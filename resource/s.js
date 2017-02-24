'use strict';

// a simple http server

var fs = require('fs'),
    os = require('os'),
    url = require('url'),
    path = require('path'),
    mime = require('mime'),
    // ecstatic = require('ecstatic'),
    http = require('http');
var root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname, // '/static/bootstrap.css'
        filepath = path.join(root, pathname); // '/srv/www/static/bootstrap.css'

    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            console.log('200 ' + request.url);
            response.writeHead(200, {
                'Content-type': mime.lookup(filepath)
            });
            fs.createReadStream(filepath).pipe(response);
        } else {
            console.log('404 ' + request.url);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8888);
var networkInterfaces = os.networkInterfaces(),
    ip = "";
for (var x in networkInterfaces) {
    networkInterfaces[x].forEach(function (ele, idx) {
        if (ele.family == 'IPv4') {
            ip = ip || ele.address;
        }
    })
}

var finalUri = 'http://' + ip + ':8888/';

console.log('Server is running at ' + finalUri);
