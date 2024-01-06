const express = require('express');
const mongoose = require("mongoose");
const like = require('../model/likeModel.js');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const likes = await like.find();
        res.json(likes);
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

        if ( !req.body.postID || !req.body.createdAt) {
            return res.status(400).send('All fields are required');
        }
        const userId = getUserIdFromToken(req);


        const newLike = new like({
            _id: new mongoose.Types.ObjectId(),
            authorID: userId,
            postID: req.body.postID,
            createdAt: req.body.createdAt,
        });

        const result = await newLike.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to like. Please try again.');
    }
});
router.get('/likedpost',async (req,res)=>{

    const userId = getUserIdFromToken(req);
    const result = await  like.find({ "authorID": `${userId}` }, { "postID": 1, "_id": 0 });
    const postIDs = result.map(item => item.postID);
    const uniquePostIDs = Array.from(new Set(postIDs));

    res.json(uniquePostIDs);
});

router.delete('/:id', async (req, res) => {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send('Invalid like ID');
        }

        const result = await like.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send('Like not found');
        }

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;