'use strict';
var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var Promise = require('promise');
var config = require('./../config/config');
var accessToken=require('./../config/AccessToken');
    <link rel="stylesheet" type="text/css" href="history/history.css" />
    <script type="text/javascript" src="history/history.js"></script>
function getAccessToken(){
	let queryParams = {
    'grant_type': 'client_credential',
    'appid': config.weixin.appId,
    'secret': config.weixin.appSecret
	};
	let url= config.weixin.profix+"token?"+qs.stringify(queryParams);
    console.log(url);
    var option = {
		method:'GET',
        url: url,
        json: true
    };
	/*return new Promise((resolve, reject) => {
		request(option, function (err, res, body) {
			if (res) {
				console.log(JSON.parse(body));
				resolve(JSON.parse(body));
			} else {
				reject(err);
			}
		});
	})*/
    /*return request(option).then(function(data){
        return Promise.resolve(data);
    });
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
		}
	})*/
	request(option, function (error, response, body) {
		if (!error &&response.statusCode == '200') {
			let data=body;
			console.log(data.access_token);
			accessToken.accessToken=data.access_token;
			console.log("tokenSave_success");
		}else{
			console.log("responseStatusCode:",response.statusCode);
		}
	});
	
};

/*function saveToken() {
	getAccessToken().then(res => {
		let token = res['access_token'];
		
	})
};*/

function refreshToken () {
	getAccessToken();
	setInterval(function () {
		getAccessToken();
	}, 7000*1000);
};

exports.refreshToken = refreshToken;
