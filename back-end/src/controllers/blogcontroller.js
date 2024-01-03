const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const  Users  = require('../model/userModel.js');
const blog = require('../model/blogModel.js');

const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });




router.get('/', async (req, res) => {
    try {
        const blogs = await blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const selectedBlog = await blog.findById(req.params.id);

        if (!selectedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.json(selectedBlog);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
}


const getUserIdFromToken = (req) => {
    const jwtToken = req.headers.authorization;

    if (jwtToken) {
        try {
            const decodedToken = decodeJwt(jwtToken);

            if (decodedToken && decodedToken.userId) {
                return decodedToken.userId;
            }
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }

    return null;
}


router.post('/', upload.array('images'), async (req, res) => {
    try {

        if (!req.body.title || !req.body.content ) {
            return res.status(400).send('All fields are required to upload a blog');
        }
        const userId = getUserIdFromToken(req);
        const user = await Users.findById(userId);

        const images = req.files.map((file) => {
            return `http://localhost:3001/uploads/${file.filename}`;
        });

        const newBlog = new blog({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            images: images,
            content: req.body.content,
            authorID: userId,
            authorName: user.userName,
            createdAt: req.body.createdAt,
        });

        const result = await newBlog.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to upload the blog. Please try again.');
    }
});
module.exports = router;