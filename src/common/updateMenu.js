var http = require('http');
var https=require('https');
var config = require('./../config/config');
var wxAccessToken=require('./wxAccessToken');
var accessToken=require('./../config/AccessToken');

//发送菜单到微信服务器
postMenu();

function postMenu(){
	wxAccessToken.refreshToken();
	console.log(config.Menu);
	var post_str = new Buffer(JSON.stringify(config.Menu));
	var post_options = {
        host : 'api.weixin.qq.com',
        port : '443',
        path : '/cgi-bin/menu/create?access_token=' + accessToken.accessToken,
        method : 'POST',
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : post_str.length
        }
    };

    var post_req = https.request(post_options, function (response) {
            var responseText = [];
            //var size = 0;
            response.setEncoding('utf8');
            response.on('data', function (data) {
                responseText.push(data);
                //size += data.length;
            });
            response.on('end', function () {
                console.log("收到微信服务器消息:", responseText);
            });
        });

    post_req.write(post_str);
    post_req.end();
}

exports.postMenu=postMenu;