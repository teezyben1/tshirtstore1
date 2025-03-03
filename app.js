const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const routes = require('./routes/user_route');


// for swagger documentation
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))


// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));
app.use('/api/v1', routes);


// Routes






module.exports = app;