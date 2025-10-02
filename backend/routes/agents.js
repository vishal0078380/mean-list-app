const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Create agent (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const agentExists = await User.findOne({ email });

    if (agentExists) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    const agent = await User.create({
      name,
      email,
      mobile,
      password,
      role: 'agent'
    });

    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      role: agent.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all agents 
router.get('/', protect, admin, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;