const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const Users = require('../model/userModel.js');
const blog = require('../model/blogModel.js');
const like = require('../model/likeModel.js');
const comment = require('../model/commentModel.js');

const router = express.Router();


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

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

router.get('/', async (req, res) => {
    try {
        const blogs = await blog.find().lean();

        const likes = await like.find();
        const comments = await comment.find();
        for (const blogItem of blogs) {

            const blogItemIdString = blogItem._id.toString();

            const blogLikes = likes.filter((likeItem) => likeItem.postID.toString() === blogItemIdString);
            blogItem.likeCount = blogLikes.length;

            const blogComment = comments.filter((commentItem) => commentItem.postID.toString() === blogItemIdString);
            blogItem.commentSet = blogComment;

        }


        res.json(blogs);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/getuserblogs', async (req, res) => {

    try{
        const userId = getUserIdFromToken(req);
        const userBlogs = await blog.find({ authorID: userId });

        res.json(userBlogs);

    }catch (error) {
        console.log(error);
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



router.post('/', upload.array('images'), async (req, res) => {
    try {

        if (!req.body.title || !req.body.content) {
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

router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const blogId = req.params.id;

        const blogToDelete = await blog.findById(blogId);

        if (!blogToDelete) {
            return res.status(404).send('Blog not found');
        }

        // Check if the user requesting the deletion is the author of the blog
        if (blogToDelete.authorID.toString() !== userId) {
            return res.status(403).send('Unauthorized: You are not the author of this blog');
        }

        await blog.findByIdAndDelete(blogId);

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:id',upload.array('images'), async (req, res) => {

    try {
        const userId = getUserIdFromToken(req);
        const blogId = req.params.id;

        const blogToUpdate = await blog.findById(blogId);

        if (!blogToUpdate) {
            return res.status(404).send('Blog not found');
        }

        // Check if the user requesting the update is the author of the blog
        if (blogToUpdate.authorID.toString() !== userId) {
            return res.status(403).send('Unauthorized: You are not the author of this blog');
        }

        // Update only the fields that are present in the request body
        if (req.body.title) {
            blogToUpdate.title = req.body.title;
        }

        if (req.body.content) {
            blogToUpdate.content = req.body.content;
        }

        if (req.files && req.files.length > 0) {
            const updatedImages = req.files.map((file) => {
                return `http://localhost:3001/uploads/${file.filename}`;
            });

            blogToUpdate.images = updatedImages;
        }

        const updatedBlog = await blogToUpdate.save();

        res.json(updatedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;