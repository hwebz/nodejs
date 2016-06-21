var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

// Array of mime types
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "images/jpeg",
	"jpg" : "images/jpeg",
	"png" : "images/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

http.createServer(function(request, respond) {
	var uri = url.parse(request.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading ' + uri);
	var stats;    

	try {
		stats = fs.lstatSync(fileName);
	} catch (Exception) {
		respond.writeHead(404, {'Content-type' : 'text/plain'});
		respond.write('404 Not Found\n');
		respond.end();
		return;
	}

	// Check if file/directory
	if (stats.isFile()) {
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		respond.writeHead(200, {'Content-type' : mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(respond);
	} else if (stats.isDirectory()) {
		respond.writeHead(302, {'Location': 'index.html'});
		respond.end();
	} else {
		respond.writeHead(500, {'Content-type' : 'text/plain'});
		respond.write('500 Internal Error\n');
		respond.end();
	}

}).listen(3000);