const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    authorID: {
        type: String,
        required: true,
    },
    postID: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
});

const like = mongoose.model('like', likeSchema, 'likes');
module.exports = like;
