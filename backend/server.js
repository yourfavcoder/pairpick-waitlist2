const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define Signup Schema
const SignupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  appFeatures: String,
  businessDiscounts: String,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

const Signup = mongoose.model('Signup', SignupSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { email, appFeatures, businessDiscounts, feedback } = req.body;
    const newSignup = new Signup({
      email,
      appFeatures,
      businessDiscounts,
      feedback
    });
    await newSignup.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error processing signup' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
