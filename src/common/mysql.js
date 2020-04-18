var mysql1 = require('mysql');
var promise=require('promise');

var connection = mysql1.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '*****',
  port     : '3306',
  database : 'zigbee'
});
//由connect/end操作的connection对象具有一次性的特点
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});
console.log('mysql connect success');

//用promise的构造函数来封装读取数据库的异步操作
//有返回数据的执行函数
function ExceDS(sql){
	return new promise(function(resolve,reject){
		connection.query(sql,function(err, results,fields){
			if (err) {
				console.log('error connecting: ' + err.stack);
				reject(err);
			}
			if (results) {
				resolve(results);
			}
		});
		//connection.end();
		//console.log('mysql disconnect success');
	});
}

//无返回数据的执行函数(insert,update,delete)
function ExecuteNonQuery(sql){
	return new promise(function(resolve,reject){
		connection.query(sql,function(err, results,fields){
			if(err){
				console.log('error connecting: ' + err.stack);
				reject(err);
			}
			if(results){
				resolve(results);
			}
			//if (fields){console.log("fields");}
		});
		//connection.end();
		//console.log('mysql disconnect success');
	});
}
						
exports.ExceDS=ExceDS;
exports.ExecuteNonQuery=ExecuteNonQuery;