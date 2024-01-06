const express = require('express');
const mongoose = require("mongoose");
const comment = require('../model/commentModel.js');
const like = require("../model/likeModel");
const Users = require("../model/userModel");


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const comments = await comment.find();
        res.json(comments);
    } catch (error) {
        res.status(500).json({error: error.message});
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

router.post('/',  async (req, res) => {

    try {

        if ( !req.body.postID || !req.body.createdAt || !req.body.content) {
            return res.status(400).send('All fields are required');
        }
        const userId = getUserIdFromToken(req);
        const user = await Users.findById(userId);

        const newComment = new comment({
            _id: new mongoose.Types.ObjectId(),
            content:req.body.content,
            authorID: userId,
            authorName:user.userName,
            postID: req.body.postID,
            createdAt: req.body.createdAt,
        });

        const result = await newComment.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to comment. Please try again.');
    }
});

router.delete('/:id', async (req, res) => {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid like ID');
        }

        const result = await comment.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send('Like not found');
        }

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid comment ID');
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).send('Comment not found');
        }

        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;