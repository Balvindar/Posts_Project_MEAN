const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users')
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/mean-course').then(
    () => {
        console.log('Connected to database')
    }).catch((e) =>{
        console.log('Connection failed', e)
    })

app.use(express.json())
app.use(express.urlencoded()) // this is optional
app.use("/images", express.static(path.join('backend/images')))
/* 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false})) // this is optional */

// for allowing cross-origin-resource-sharing(CORS)
app.use((req,res,next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Only needed if using credentials

    next();
})

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)


module.exports = app;