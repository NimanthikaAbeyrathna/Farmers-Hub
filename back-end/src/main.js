require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/usercontroller');
const blogController = require('./controllers/blogcontroller');


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/farmers_hub')
    .then(()=> console.log('connected...'))
    .catch((err)=> console.log(err.message));

app.use('/app/api/v1/user', userController);
app.use('/app/api/v1/blog', blogController);


app.listen(3001, () => { console.log(`starting port 3001...`)});

module.exports = app;