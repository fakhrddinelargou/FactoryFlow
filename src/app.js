const express = require('express');
const app = express();


const installationRoutes = require('./routes/installation.routes');
app.use(express.json());                              // ✅ 9bel routes

// MIDDLEWARES
const notFound = require('./middlewares/notFound');
const ErrorHandler = require('./middlewares/ErrorHandler');
// ROUTING
app.use('/api/installation', installationRoutes);

app.use(notFound);
app.use(ErrorHandler);
module.exports = app;
