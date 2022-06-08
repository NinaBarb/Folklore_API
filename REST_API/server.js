
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { stat } = require('fs');
let cors = require("cors");
const { NONAME } = require('dns');

const app = express();
const server = http.createServer(app);

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:19006', 'https://folklore-oicar-web.herokuapp.com']
}));

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.use('/', require('./ROUTES/pages'));

var port = process.env.PORT || 8091;
server.listen(port);
console.log('User API is running at ' + port);