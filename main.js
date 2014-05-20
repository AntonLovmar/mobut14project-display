var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var RedisStore = require('connect-redis')(express);	
var redis = require("redis").createClient();
app.use( express.cookieParser() );

app.use(express.session({
  store: new RedisStore({ host: 'localhost', port: 6379, client: redis }),
  secret: 'C71ayRBMouibaprErk'
}));



app.use(express.static(__dirname + '/public_html'));

var httpServer = http.createServer(app);
httpServer.listen(8080);