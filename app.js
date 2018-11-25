var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var randomBytes = require('random-bytes');

app.use(express.static('public'));
app.use(bodyParser.urlencoded());

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tlstmdduf5",
    database: "ELECVOTE"
    });

connection.connect();

var server = app.listen(3000, function () {
    console.log('Express server has started on port 3000');

});


var router = require('./router')(app,randomBytes,connection);
