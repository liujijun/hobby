/* server.js */

var restify = require('restify');
var http = require('http');
var https = require('https');

// Manual set `maxSockets` to 10 for limit concurrents
http.globalAgent.maxSockets = 10;
https.globalAgent.maxSockets = 10;

var addr = process.env['HOBBY_ADDR'] || '0.0.0.0';
var port = process.env['HOBBY_PORT'] || 3000;

var server = restify.createServer({
  name: 'hobby',
  version: '0.0.3',
});

server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.requestLogger());

// Service
require('./lib/tasks').bootstrap();
// Routes
require('./routes')(server);

server.listen(port, addr, function () {
  console.log('%s listening at %s', server.name, server.url);
});
