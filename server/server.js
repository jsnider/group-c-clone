/**
 * Created by danielghandahari on 2018-01-23.
 */
//server/server.js
const {createServer} = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const Item = require('../models/Item');

var mongoose = require ("mongoose");

var router = require('./routes/routes.js');

//  type: heroku config:get MONGODB_URI
//  You can add mLab to your app either through the add-on catalog or through the heroku command.
//  https://devcenter.heroku.com/articles/mongolab
var uristring = 'mongodb://armanv:OVtDy6R9ZgnYI3qZ5IUZB@ds117158.mlab.com:17158/scrubit';

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);

const app = express();
const dev = app.get('env') !== 'production';

app.use('/', router);

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});



if(!dev) {
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(path.resolve(__dirname, '../build')));



    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    })

}

if(dev) {
    app.use(morgan('dev'));

}

const server = createServer(app);

server.listen(PORT, err => {
    if(err) throw err;

    console.log('Server started!');
});
