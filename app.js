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


server.get('/getAllProducts', function (req, res, next) {
    products.find({
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

server.get('/getProduct', function (req, res, next) {
    products.find({
        name: req.params.name
    }, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(data));
    });
    return next();
});

server.post('/addProduct', function (req, res, next) {
    var product = req.params;

    res.setHeader('Access-Control-Allow-Origin','*');
    	
    products.save(product, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

server.put('/editProductName', function(req, res, next) {

    products.update({
        name : req.params.name
    	},
	    {$set: { name : req.params.newname }
    }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();

});

server.put('/updateProduct', function (req, res, next) {
    // get the existing product
    products.findOne({
        name: req.params.name
    }, function (err, data) {
        // merge req.params/product with the server/product
 
        var updProd = {}; // updated products 
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
            updProd[n] = data[n];
        }
        for (var n in req.params) {
            updProd[n] = req.params[n];
        }
        products.update({
            name : req.params.name
        }, updProd, {
            multi: false
        }, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    });
    return next();
});

server.del('/delProduct', function (req, res, next) {
    var product = {};
    	product.name = req.params.name;

    res.setHeader('Access-Control-Allow-Origin','*');
    	
    products.remove(product, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});


