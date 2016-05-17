/**
 * Created by pandys01 on 21/04/2016.
 */
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//Start server on 3000 port
http.listen(2500, function(){
    console.log('Diff generator Server started on port 2500');
});
