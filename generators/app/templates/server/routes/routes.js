module.exports = function(server) {
    // Defining all the routes
    server.get('/', function(req, res) {
        res.render('index.html');
    });
};