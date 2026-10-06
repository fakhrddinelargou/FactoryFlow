const express = require('express');
const app = express();

// MIDDLEWARES
const notFound = require('./middlewares/notFound');
const ErrorHandler = require('./middlewares/ErrorHandler');
// ROUTING

app.use(notFound);
app.use(ErrorHandler);
module.exports = app;
