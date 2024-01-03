const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  Users  = require('../model/userModel.js');

const router = express.Router();





router.get('/', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const selectedUser = await Users.findById(req.params.id);

        if (!selectedUser) {
            return res.status(404).send('User not found');
        }

        res.json(selectedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {

        if (!req.body.age || !req.body.email || !req.body.password || !req.body.userName) {
            return res.status(400).send('All fields are required to save a user');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new Users({
            _id: new mongoose.Types.ObjectId(),
            age: req.body.age,
            email: req.body.email,
            password: hashedPassword,
            createdAt: req.body.createdAt,
            userName: req.body.userName
        });

        const result = await user.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create user. Please try again.');
    }
});

router.patch('/:id', async (req, res) => {

    try {
        const result = await Users.findById(req.params.id);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        result.set({
            age: req.body.age,
            email: req.body.email,
            password: hashedPassword,
            createdAt: req.body.createdAt,
            userName: req.body.userName
        })

        try {
            const savedUser = await result.save();
            res.send(savedUser);
        } catch (err) {
            for (const field in err.errors) {
                res.status(500).send(err.errors[field].message);
            }
        }

    } catch (err) {
        res.status(500).send('Not Found!');
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const result = await Users.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).send('Not Found');
    }

});

router.post('/login', async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await Users.findOne({email});
        if (!user) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const token = jwt.sign({userId: user._id}, 'your_secret_key', {
            expiresIn: '1h',
        });

        res.json({token});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/updatepassword', async (req, res) => {
    try {

        const email = req.body.email;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        const user = await Users.findOne({email});

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({error: 'Current password is incorrect'});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await Users.findOneAndUpdate({email}, {password: hashedNewPassword});

        const token = jwt.sign({userId: user._id}, 'your_secret_key', {
            expiresIn: '1h',
        });

        res.json({message: 'Password updated successfully', token});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;