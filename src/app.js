const express = require('express');
const app = express();


const installationRoutes = require('./routes/installation.routes');
const userRoutes = require('./routes/user.routes');
app.use(express.json());                              
// MIDDLEWARES
const notFound = require('./middlewares/notFound');
const ErrorHandler = require('./middlewares/ErrorHandler');
// ROUTING
app.use('/api/installation', installationRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(ErrorHandler);
module.exports = app;
