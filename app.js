const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');



// for swagger documentation
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.set('view engine', 'ejs');
// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Importing all routes
const user = require('./routes/user_route');
const { signup } = require('./controllers/user_controller');


// Routes Middleware
app.use('/api/v1', user);
app.get('/signup',(req,res)=>{
    res.render("signup")
})


// Routes






module.exports = app;