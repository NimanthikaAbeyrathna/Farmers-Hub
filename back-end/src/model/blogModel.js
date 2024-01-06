const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: [{ type: String }],
        default: [],
    },
    content: {
        type: String,
        required: true,
    },
    authorID: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },

});

const blog = mongoose.model('blog', blogSchema, 'blogposts');
module.exports = blog;