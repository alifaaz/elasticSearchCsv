const http = require('http');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const cors = require('cors')
const bodyParser = require('body-parser')
const morganLogger = require('morgan')
const CustomerRouters = require('../customers/cust.router')
const app = express()

// logger to register all incoming request through this app
app.use(morganLogger('dev'));

// parse body && params and assign it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// allw enable cros oringn  resources sharing
app.use(cors());


app.use("/api",CustomerRouters)
app.use("/*", (req, res) => {

    return res.status(404).json({
        msg: 'no such resources '
    })
})

module.exports= app