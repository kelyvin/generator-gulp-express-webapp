var serveStatic = require('serve-static');
var server = require('./server/server')();

server.set('views', './dist');
server.use(serveStatic('dist', {
    'index': ['index.html']
}));

server.listen(server.get('port'), function () {
    console.log('✔ Express server listening connected listening on: ' + server.get('port'));
});