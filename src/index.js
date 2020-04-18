var server = require("./server");
var router = require("./routes/router");
var requestHandlers = require("./common/requestHandlers");
var weixin=require("./common/weixin");

var handle = {}
//验证tonken
handle["/weixin"] = weixin.weixin;
//业务功能
//handle["/"] = server.start;
handle["/liveGet"] = requestHandlers.liveGet;
handle["/public/swfobject.js"] = requestHandlers.resGet;
handle["/public/Main.swf"] = requestHandlers.swfGet;
//handle["/equipStateGet"] = requestHandlers.equipStateGet;
//handle["/postMenu"]=requestHandlers.postMenu;

server.start(router.route, handle);
