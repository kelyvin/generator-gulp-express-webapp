var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes/routes');
var api = require('./api/api');

function Server() {
    var app = express();
    var port = process.env.PORT || 9000;


    // Remove x-powered-by header (doesn't let clients know we are using Express)
    app.disable('x-powered-by');

    // Setup view engine for server side templating
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('port', port);

    // Returns middleware that parses both json and urlencoded.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Returns middleware that parses cookies
    app.use(cookieParser());

    routes(app);
    api(app);

    return app;
}

module.exports = function() {
    return new Server();
};