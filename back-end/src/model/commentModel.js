const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    content:{
        type: String,
        required: true,
    },
    authorID: {
        type: String,
        required: true,
    },
    authorName:{
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

const comment = mongoose.model('comment', commentSchema, 'comments');
module.exports = comment;
