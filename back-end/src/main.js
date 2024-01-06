require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/usercontroller');
const blogController = require('./controllers/blogcontroller');
const likeController = require('./controllers/likescontroller');
const commentController = require('./controllers/commentcontroller');
const path = require("path");


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/farmers_hub')
    .then(()=> console.log('connected...'))
    .catch((err)=> console.log(err.message));

app.use('/app/api/v1/user', userController);
app.use('/app/api/v1/blog', blogController);
app.use('/app/api/v1/like', likeController);
app.use('/app/api/v1/comment', commentController);


app.listen(3001, () => { console.log(`starting port 3001...`)});

module.exports = app;