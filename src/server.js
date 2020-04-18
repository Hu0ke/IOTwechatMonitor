var http = require('http');
var url = require('url');
var rtmp =require('./RTMP/rtmp_test')

function start(route,handle) {
	rtmp.rtmpRun();
	http.createServer(
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		
		console.log("["+Date().toLocaleString()+"]"+"["+request.method+"]"+"[" + pathname+"]");
		if (pathname != "/favicon.ico") {
			//var contenttype;
			//response.writeHead(200,{"Content-Type":"text/plain"});
			/*var content = */
			route(handle,pathname,request,response);
			//response.write(content);
			//response.end();
		}
	}).listen(8082);
	
	console.log('Server running at http://127.0.0.1:8082/');
}

/*
wechatVerification(req, res) {
    var query = url.parse(req.url, true).query;
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = config.wechat.token;
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature);
    var scyptoString = wechatHelper.sha1(original);
    if (signature == scyptoString) {
      res.end(echostr);
      console.log("Confirm and send echo back");
    } else {
      res.end("false");
      console.log("Failed!");
    }
  }
*/

exports.start=start;
