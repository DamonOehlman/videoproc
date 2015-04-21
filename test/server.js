var fs = require('fs');
var path = require('path');
var http = require('http');
var mime = require('mime');

module.exports = function() {
  return http.createServer(function(req, res) {
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
};
