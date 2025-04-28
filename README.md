# KnightBot

A web-based chess game with an AI opponent using the minimax algorithm with alpha-beta pruning.

## Features
- Play chess against AI with adjustable difficulty
- Analyze possible moves with visualization
- View move history with standard notation
- Undo/redo functionality
- Free play mode for board setup
- Save games to localStorage
- Share games via URL

## Live Demo
[Play KnightBot](https://ibramich3.github.io/KnightBot/)
## Setup
1. Clone this repository
   ```
   git clone (https://github.com/ibramich3/KnightBot)
   cd knightbot
   ```
2. Open `index.html` in a web browser or deploy to GitHub Pages

## Documentation

### Frontend
The frontend is built with vanilla JavaScript and HTML5 Canvas:

- **index.html**: Main entry point with game UI
- **app.js**: Core game logic and rendering
- **bot.js**: AI implementation with minimax algorithm

#### UI Components
- Chess board rendered on HTML5 Canvas
- Move history table
- Control panel with game options

#### Game Features
- **Move Analysis**: Visualizes the AI's evaluation of possible moves
- **Auto Move**: Enables automatic moves by the AI
- **Free Mode**: Allows moving any piece regardless of turn
- **Best Move**: AI suggests the optimal move for the current position
- **Undo/Redo**: Navigate through the game's move history

### Game Sharing
Share your current game via a URL that encodes the game state:

```javascript
// Generate shareable link
const shareableLink = createShareableLink();
// Share link with others who can continue from the exact position
```

The sharing mechanism uses base64 encoding to compress the game state into a URL parameter without requiring a backend server.

### Backend
This implementation uses client-side storage and doesn't require a traditional backend:

- **Local Storage**: Game state persistence between sessions
- **URL-based Sharing**: Share games without a database

#### Potential Backend Extensions
- User accounts and authentication
- Server-side game state storage
- Multiplayer functionality
- ELO rating system
