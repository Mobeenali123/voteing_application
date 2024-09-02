// routes/router.js

const express = require('express');
const router = express.Router();
const Signup = require('../models/signup');
const Candidate = require('../models/candidate');
const Vote = require('../models/vote.js');
const { generateToken, jwtauthmiddleware}=require('../jwt.js')
const mongoose = require('mongoose');

// Sign-up a new user
router.post('/signup', async (req, res) => {
    try {
        const newUser = new Signup(req.body);
        await newUser.save();
        res.status(201).json({ message: 'Voter registered successfully' });
        console.log("Voter registered successfully");
        const payload = {
            id: newUser.id,
            name: newUser.name,

        }
        const token = generateToken(payload);
        console.log("Token genrate sucessfully");
        res.status(200).json({ 'response': response, 'token': token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Sign-in an existing user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Signup.findOne({ username, password });
        if (user) {
            const payload = {
                id: user.id,
                name: user.name,
            }
            const token = generateToken(payload);
            console.log("Token is:", token);
            res.status(200).json({  message: 'Login successful', 'token': token });
           
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get the list of all candidates
router.get('/candidates',jwtauthmiddleware, async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Vote for a candidate


// Vote for a candidate
router.post('/vote/:candidateId', async (req, res) => {
    try {
        const { id_card_num } = req.body;
        let candidateId = req.params.candidateId;

         console.log('Received candidateId:', candidateId); // Debugging line

      

        // Convert candidateId to ObjectId
        const candidateObjectId = new mongoose.Types.ObjectId(candidateId); // Correct way to create ObjectId

        // Check if the voter has already voted using the id_card_num
        const existingVote = await Vote.findOne({ id_card_num });
        if (existingVote) {
            return res.status(400).json({ message: 'Voter has already voted' });
        }

        // Create a new vote
        const newVote = new Vote({ id_card_num, candidateId: candidateObjectId });
        await newVote.save();

        // Update vote count in candidate model
        await Candidate.findByIdAndUpdate(candidateObjectId, { $inc: { votes: 1 } });

        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        console.error('Error:', error); // Detailed error logging
        res.status(400).json({ error: error.message });
    }
});



// Get the vote count
router.get('/vote/count',jwtauthmiddleware, async (req, res) => {
    try {
        const voteCounts = await Candidate.find({}, 'name votes');
        res.status(200).json(voteCounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin: Add a new candidate
router.post('/candidate',jwtauthmiddleware, async (req, res) => {
    try {
        const newCandidate = new Candidate(req.body);
        await newCandidate.save();
        res.status(201).json({ message: 'Candidate added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin: Update an existing candidate
router.put('/candidate/:candidateId',jwtauthmiddleware, async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, req.body, { new: true });
        res.status(200).json(updatedCandidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Admin: Delete a candidate
router.delete('/candidate/:candidateId',jwtauthmiddleware, async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        await Candidate.findByIdAndDelete(candidateId);
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/profile', jwtauthmiddleware, async (req, res) => {
    try {
        // Fetch the user information using the data from the token
        const userId = req.user.id; // Assuming the token contains the user's ID
        const user = await Signup.findById(userId); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Profile data fetched successfully");
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
