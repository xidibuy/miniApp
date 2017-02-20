'use strict';

// a simple http server

const fs = require('fs');
const os = require('os');
const url = require('url');
const path = require('path');
const mime = require('mime');
const opener = require('opener');
const https = require('https');
const root = path.resolve(process.argv[2] || '.');
const port = 8000;

const privateKey = fs.readFileSync('./privatekey.pem', 'utf8');
const certificate = fs.readFileSync('./certificate.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

console.log('Static root dir: ' + root);

// https
https.createServer(credentials, (req, res) => {
    let pathname = url.parse(req.url).pathname;
    let filepath = path.join(root, pathname);

    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            console.log('200 ' + req.url);
            res.writeHead(200, {
                'Content-type': mime.lookup(filepath)
            });
            fs.createReadStream(filepath).pipe(res);
        } else {
            console.log('404 ' + req.url);
            res.writeHead(404);
            res.end('404 Not Found');
        }
    });
}).listen(port, function () {
    let networkInterfaces = os.networkInterfaces();
    let ip = "";
    for (let x in networkInterfaces) {
        networkInterfaces[x].forEach(function (ele, idx) {
            if (ele.family == 'IPv4') {
                ip = ip || ele.address;
            }
        })
    }

    // let finalUri = 'https://' + ip + ':' + port + '/index.html';
    let finalUri = 'https://' + ip + ':' + port;

    console.log('Server is running at ' + finalUri);
    //opener(finalUri);
});


