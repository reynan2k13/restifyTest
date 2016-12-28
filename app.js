var restify = require('restify');
var mongojs = require("mongojs");

var db = mongojs('mongodb://reynan2k13:chocobo12345@ds145158.mlab.com:45158/restifyrey', ['myapp']);
var products = db.collection("products");
 
var ip_addr = '127.0.0.1';
var port    =  '3000';
 
var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
 
server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

server.get('/getProductById', function (req, res, next) {
    products.findOne({
        productId: req.params.productId
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

