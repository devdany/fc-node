var express = require('express');

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('mongodb connected');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/fc', {useMongoClient: true});
autoIncrement.initialize(connect);



var admin = require('./routes/admin');

var app = express();
var port = 3000;

app.get('/',(req, res) => {
    res.send('first');
});

app.use('/admin', admin);


app.listen(port, () => {
    console.log('express listening on port', port);
});