const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/knightbot')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game Schema
const gameSchema = new mongoose.Schema({
  gameId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => Math.random().toString(36).substring(2, 15)
  },
  board: [[String]],
  currentPlayer: String,
  moveHistory: [[String]],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Game = mongoose.model('Game', gameSchema);

// API Routes
app.post('/api/games', async (req, res) => {
  try {
    const game = new Game({
      board: req.body.board,
      currentPlayer: req.body.currentPlayer,
      moveHistory: req.body.moveHistory
    });
    await game.save();
    res.json({ gameId: game.gameId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.get('/api/games/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve game' });
  }
});

app.put('/api/games/:gameId', async (req, res) => {
  try {
    const game = await Game.findOneAndUpdate(
      { gameId: req.params.gameId },
      { 
        board: req.body.board,
        currentPlayer: req.body.currentPlayer,
        moveHistory: req.body.moveHistory,
        updatedAt: Date.now()
      },
      { new: true }
    );
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 