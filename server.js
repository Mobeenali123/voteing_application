// server.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./routes/vroute');
const db = require('./db')

// Middleware
const midware = function(req, res, next){
    console.log(`[${new Date().toLocaleString()}] : Request made to: ${req.originalUrl}`);
    next(); // This is important to pass control to the next route handler/functions
 };
 app.use(midware);

const bodyparser = require('body-parser');
app.use(bodyparser.json());


// Use the router~
app.use('/user', router);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
