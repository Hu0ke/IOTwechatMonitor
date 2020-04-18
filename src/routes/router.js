function route(handle, pathname,req,res) {
  if (typeof handle[pathname] === 'function') {
	console.log("About to route a request for " + pathname);
	handle[pathname](req,res);
  } else {
    console.log("No request handler found for " + pathname);
	let msg="404 not found"
	return msg;
  }
}

exports.route = route;

/*route的switch方法
	switch(pathname){
        case '/':
        case '/home':
			console.log("About to route a request for " + pathname);
            showPaper('./view/a.html',200);
            break;
        case '/about':
			console.log("About to route a request for " + pathname);
            showPaper('./view/b.html',200);   
            break;
        default:
			console.log("No request handler found for " + pathname);
            showPaper('./view/404.html',404);
            break;                            
    }
*/
