var http = require('http');
var https=require('https');
var url = require('url');
var request = require('request');
var Promise = require('promise');
var qs = require('querystring');
var config = require('./../config/config');
var wxAccessToken=require('./wxAccessToken');
var accessToken=require('./../config/AccessToken');
var	path=require('path');
var fs= require('fs');

//画面实时接口
function liveGet(req,res) {
	console.log("Request handler 'liveGet' was called.");
	//res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
	fs.readFile("/home/wx/liveWeb/index.html",'utf-8',function(err,data){
		if(err){
			console.error(err);
			res.end("404 not fond");
		}else{
			res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
			res.end(data);
		}
	});
	//res.write('../liveWeb/index.html');
	//res.end();
	//showPaper('../liveWeb/index.html',200);
}

//设备实时状态
function resGet(req,res) {
		fs.readFile("/home/wx/liveWeb/public/swfobject.js",function(err,data){
		if(err){
			console.error(err);
		}else{
			res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
			res.end(data);
		}
	});
}

function swfGet(req,res) {
		fs.readFile("/home/wx/liveWeb/public/Main.swf",function(err,data){
		if(err){
			console.error(err);
		}else{
			res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
			res.end(data);
		}
	});
}

function faceCheck(){
	
}

function userFaceKeySave(){
	
}

exports.liveGet = liveGet;
exports.resGet = resGet;
exports.swfGet = swfGet;
//exports.equipStateGet = equipStateGet;

