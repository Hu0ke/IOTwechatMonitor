var http = require('http');
var url = require('url');
var crypto = require('crypto');
var promise=require('promise');
var XMLJS = require('xml2js');
var builder=new XMLJS.Builder();
var parser=new XMLJS.Parser();
var config=require('./../config/config');
var mysql=require('./mysql');

function weixin(req,res){	
	//验证token
	var query = url.parse(req.url,true).query;
	var state=0;//1绑定，2解绑，3.。。。
	if(check(query.timestamp,query.nonce,query.signature,config.weixin.token)){
		if ((req.body =="undefined") && (req.method=="GET")){
			res.end(query.echostr);
		} 
		else{
			req.on("data", function(data) {
				//console.log("data:\n",data);
				//console.log("data:\n",data.toString());
				parser.parseString(data.toString(), function(err, result) {
					var body = result.xml;
					console.log("body:\n",body);
					var messageType = body.MsgType;
					if(messageType == 'event') {
						process.stdout.write("This is the event");
						var eventName = body.Event;
						(EventFunction[eventName]||function(){})(body, req, res);
					}
					else if(messageType == 'text') {
						console.log("This is the text reply:\n");
						res.write("success");
						responseText(body, res);
						res.end();
					}
					else if(messageType == 'image') {
						console.log("This is the image reply:\n");
						res.write("success");
						res.end();
						//EventFunction.(body, res);
					}
					else {
						console.log("error");
						//res.write(err);
						res.end();
					}
				});
			});
		}
	}else{
		res.write("error:",err);
		res.end();
	};
};
	
var EventFunction = { 
	"subscribe":function(result, req, res) {
		let message=result;
		var now = new Date().getTime();
		var reply =  '<xml>'
					+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
					+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
					+'<CreateTime>'+now+'</CreateTime>'
					+'<MsgType><![CDATA[text]]></MsgType>'
					+'<Content><![CDATA[欢迎订阅！]]></Content>'
					+'</xml>';
		var sql="insert INSERT INTO devBind (wxUID,door,window1,window2,window3,led1,led2,smoke,hongwai,gm,tp) VALUES ('" + message.FromUserName + "',-1,-1,-1,-1,-1,-1,-1,-1,-1)";
		mysql.ExceDS(sql).then(function(results){			
			var string=JSON.stringify(results);
			}).catch(function(err){});
		console.log(reply);
		res.write(reply);
		res.end();
	},
	
	"unsubscribe":function(result, req, res) {
		console.log("取消关注:",result.FromUserName);
	},
	
	"CLICK":function(result,req,res){
		let message=result;
		var eventKey=message.EventKey.toString();
		//var now=new Date.getTime();
		var reply;
		
		var date = new Date();
		var sign1 = "-";
		var sign2 = ":";
		var year = date.getFullYear()
		var month = date.getMonth() + 1;
		var day  = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		if (seconds<10){
			seconds='0'+seconds.toString();
		}
		var dateTime=year 
					+ sign1 
					+ month 
					+ sign1 
					+ day 
					+ " " 
					+ hour 
					+ sign2 
					+ minutes 
					+ sign2 
					+ seconds
		process.stdout.write("[click]");
		//console.log("eventKey:",eventKey);
		switch (eventKey){
			case 'V1001_Quip_State':
				console.log("[V1001_Quip_State] reply:\n");
				res.write("success");//延迟类需要先success回应
				let sql1="select * from nodeInfo where wxUID='" + message.FromUserName + "'";
				let sql2="select *  from humiture order by time desc limit 1";
				mysql.ExceDS(sql1).then(function(results){
					var replyString="";
					var string=JSON.stringify(results);
					console.log("JSON.stringify(results):",string);
					if (string!="[]"){
						var json=JSON.parse(string);
						console.log("JSON.parse(string):\n",json);
						if (json[0].door==1){replyString +="门:开\n";} else if(json[0].door==0){replyString +="门:关\n";}else {replyString +="门:未绑定\n";}
						if (json[0].window1==1){replyString +="阳台窗户:开\n";}else if(json[0].window1==0){replyString +="阳台窗户:关\n";}else {replyString +="阳台窗户:未绑定\n";}
						if (json[0].window2==1){replyString +="卧室窗户:开\n";}else if (json[0].window2==0){replyString +="卧室窗户:关\n";}else {replyString +="卧室窗户:未绑定\n";}
						if (json[0].window3==1){replyString +="厨房窗户:开\n";}else if (json[0].window3==0){replyString +="厨房窗户:关\n";}else {replyString +="厨房窗户:未绑定\n";}
						if (json[0].led1==1){replyString +="客厅灯:开\n";}else if (json[0].led1==0){replyString +="客厅灯:关\n";}else {replyString +="客厅灯:未绑定\n";}
						if (json[0].led2==1){replyString +="卧室灯:开\n";}else if (json[0].led2==0){replyString +="卧室灯:关\n";}else {replyString +="卧室灯:未绑定\n";}
					}else {
						replyString +="未查询到数据!";
					}
						console.log(sql2);
						mysql.ExceDS(sql2).then(function(results){
						
						var string=JSON.stringify(results);
						console.log("JSON.stringify(results):",string);
						if (string!="[]"){
						var json=JSON.parse(string);
						console.log("JSON.parse(string):\n",json);
						replyString +="温度:"+json[0].humd+"湿度:"+json[0].temp;
						console.log(replyString);

						}else {
							replyString +="未查询到温湿度数据!";
						}
						reply = '<xml>'
									+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
									+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
									+'<CreateTime>'+date.getTime()+'</CreateTime>'
									+'<MsgType><![CDATA[text]]></MsgType>'
									+'<Content><![CDATA['
									+replyString
									+']]></Content>'
									+'</xml>';
						res.write(reply);
						res.end();
						}).catch(function(err){});
					
				}).catch(function(err){/*此处应当是这样*/});
//nodejs中未定义的变量会导致字符累加中断
				break;
			case 'V1001_Open_Door':						
				console.log("[V1001_Open_Door] reply:\n");
				res.write('success');
				res.end();
				break;
			case 'V1001_Open_window':
				console.log("[V1001_Open_windpw] reply:\n");
				res.write("success");
				let sql="select window1 from nodeInfo where wxUID='" + message.FromUserName + "'";
				mysql.ExecuteNonQuery(sql).then(function(results){
					var string=JSON.stringify(results);
					var json=JSON.parse(string);
					if (json[0].window1==0 ){
						let sql2="update nodeInfo set window1 = 1";
						mysql.ExecuteNonQuery(sql2).then(function(results){
							reply = '<xml>'
								+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
								+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
								+'<CreateTime>'+date.getTime()+'</CreateTime>'
								+'<MsgType><![CDATA[text]]></MsgType>'
								+'<Content><![CDATA['
								+"开窗操作成功"
								+']]></Content>'
								+'</xml>';
							res.write(reply);
							res.end();
						}).catch(function(err){});
					}else if (json[0].window1==1 ){
						let sql2="update nodeInfo set window1 =0";
						mysql.ExecuteNonQuery(sql2).then(function(results){
							reply = '<xml>'
								+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
								+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
								+'<CreateTime>'+date.getTime()+'</CreateTime>'
								+'<MsgType><![CDATA[text]]></MsgType>'
								+'<Content><![CDATA['
								+"关窗操作成功"
								+']]></Content>'
								+'</xml>';
							res.write(reply);
							res.end();
						}).catch(function(err){});
					}else{
						reply = '<xml>'
								+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
								+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
								+'<CreateTime>'+date.getTime()+'</CreateTime>'
								+'<MsgType><![CDATA[text]]></MsgType>'
								+'<Content><![CDATA['
								+"操作失败，设备未绑定"
								+']]></Content>'
								+'</xml>';
							res.write(reply);
							res.end();
					}
				}).catch(function(err){});
				break;
			case 'V1001_Open_Led':						
				console.log("[V1001_Open_Led] reply:\n");
				res.write('success');
				res.end();
				break;
			case 'V1001_devBind':
				console.log("[V1001_devBind] reply:\n");
				state=1;
				reply = '<xml>'
						+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
						+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
						+'<CreateTime>'+date.getTime()+'</CreateTime>'
						+'<MsgType><![CDATA[text]]></MsgType>'
						+'<Content><![CDATA['
						+"请输入设备序列号绑定[输入q取消操作]"
						+']]></Content>'
						+'</xml>';
					res.write(reply);
				res.end();
				break;
			case 'V1001_devUBind':
				console.log("[V1001_devBind] reply:\n");
				state=2;
				reply = '<xml>'
						+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
						+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
						+'<CreateTime>'+date.getTime()+'</CreateTime>'
						+'<MsgType><![CDATA[text]]></MsgType>'
						+'<Content><![CDATA['
						+"请输入设备序列号解绑[输入q取消操作]"
						+']]></Content>'
						+'</xml>';
					res.write(reply);
				res.end();
				break;
		}
		//console.log(reply);
		//res.write('success');
		//res.end();
	},
	
	"pic_sysphoto":function(result,req,res){
		let message=result;
		var now = new Date().getTime();
		var reply =  '<xml>'
					+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
					+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
					+'<CreateTime>'+now+'</CreateTime>'
					+'<MsgType><![CDATA[image]]></MsgType>'
					+'<Image>'
					+'<MediaId><![CDATA['+message.MediaId+']]></MediaId>'
					+'</Image>'
					+'</xml>';
		//console.log(reply);
		res.write(reply);
		res.end();
	}
};

function responseText(result, res) {
		if (state==1) {
			if (result.Content!="q"){
				mysql.ExecuteNonQuery("INSERT INTO devBind (wxUID,devID) VALUES ('" + result.FromUserName + "','"+result.Content+"')");
				state=0;console.log("已绑定");
			}else{ state=0;console.log("已取消q");}
		}else if (state==2){
			if (result.Content!="q"){
				mysql.ExecuteNonQuery("delete from devBind where wxUID='"+result.FromUserName+"' and devID = '"+result.Content+"'");
				state=0;console.log("已解绑");
			}else{ state=0;console.log("已取消q");}
		}else{
			reply = '<xml>'
						+'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'
						+'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'
						+'<CreateTime>'+date.getTime()+'</CreateTime>'
						+'<MsgType><![CDATA[text]]></MsgType>'
						+'<Content><![CDATA['
						+"别发了程序要crash了"
						+']]></Content>'
						+'</xml>';
			res.write(reply);
			res.end();
		}
	}

function check(timestamp,nonce,signature,token){
	var currSign,tmp;
	tmp = [token,timestamp,nonce].sort().join("");
	currSign = crypto.createHash("sha1").update(tmp).digest("hex");
	console.log(currSign=== signature);
	return (currSign === signature);  
};

exports.weixin =weixin;