var fs = require('fs');
var path = require('path');
var http = require('http');
var mime = require('mime');
var server = http.createServer();
var port = process.env.ZUUL_PORT || process.env.PORT;

server.on('request', function(req, res) {
  var src;

  if (req.url === '/tennis.webm') {
    src = path.resolve(__dirname, 'assets', 'tennis.webm');
  }

  if (src) {
    res.writeHead(200, { 'Content-Type': mime.lookup(src) });
    fs.createReadStream(src).pipe(res);
  }
  else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(parseInt(port, 10) || 3000);