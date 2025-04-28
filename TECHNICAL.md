
## Architecture Overview

KnightBot is a browser-based chess game built with vanilla JavaScript, HTML5, and CSS. The application follows a modular architecture:

- **UI Layer**: HTML/CSS interface components and canvas rendering
- **Game Logic**: Core chess rules, game state management, and move validation
- **AI Engine**: Chess bot implementation using minimax with alpha-beta pruning

## Core Components

### 1. Chess Board Representation

The chess board is represented as a 2D array where:
- Uppercase letters represent white pieces: P, R, N, B, Q, K
- Lowercase letters represent black pieces: p, r, n, b, q, k
- Empty spaces are represented by a space character

```javascript
let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    // ...and so on
];
```

### 2. Game State Management

Game state consists of:
- Current board position
- Current player (white/black)
- Move history
- Undo/redo stacks

### 3. AI Implementation

The AI is implemented in `bot.js` using the minimax algorithm with alpha-beta pruning:

#### Minimax with Alpha-Beta Pruning
```javascript
minimax(board, depth, alpha, beta, isMaximizingPlayer) {
    // Base case: evaluation at leaf nodes
    if (depth === 0) {
        return this.evaluateBoard(board);
    }

    // Recursive case with pruning
    if (isMaximizingPlayer) {
        // Maximizing player logic
        let bestScore = -Infinity;
        // For each possible move...
        // ...
        return bestScore;
    } else {
        // Minimizing player logic
        let bestScore = Infinity;
        // For each possible move...
        // ...
        return bestScore;
    }
}
```

#### Position Evaluation
The evaluation function assigns scores to board positions based on:
- Material value (piece count and type)
- Piece position (using piece-square tables)
- Mobility and control of the center

### 4. Local Storage Implementation

Game states are saved to localStorage for persistence between sessions:

```javascript
function saveGame() {
    const gameState = {
        board: board,
        currentPlayer: currentPlayer,
        moveHistory: moveHistory
    };
    
    localStorage.setItem('knightbotSavedGame', JSON.stringify(gameState));
}

function loadSavedGame() {
    const savedGame = localStorage.getItem('knightbotSavedGame');
    
    if (savedGame) {
        const gameState = JSON.parse(savedGame);
        board = gameState.board;
        currentPlayer = gameState.currentPlayer;
        moveHistory = gameState.moveHistory;
        
        drawBoard();
        updateMoveHistoryTable();
    }
}
```

### 5. Game Sharing Implementation

The game sharing feature allows players to share their current game via URL without requiring a backend server:

#### Creating Shareable Links
```javascript
function createShareableLink() {
    const gameState = {
        b: board.map(row => row.join('')).join('|'), // compressed board
        p: currentPlayer,
        h: moveHistory.map(m => `${m[0]}-${m[1]}`).join(',') // compressed history
    };
    
    const compressedState = btoa(JSON.stringify(gameState));
    return `${window.location.origin}${window.location.pathname}?game=${compressedState}`;
}
```

#### Loading Shared Games
```javascript
function loadSharedGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    
    if (gameParam) {
        try {
            const gameState = JSON.parse(atob(gameParam));
            // Restore game from compressed state
            board = gameState.b.split('|').map(row => row.split(''));
            currentPlayer = gameState.p;
            moveHistory = gameState.h.split(',').map(m => m.split('-'));
            
            drawBoard();
            updateMoveHistoryTable();
        } catch (e) {
            console.error("Failed to load shared game:", e);
        }
    }
}
```

## Deployment

### GitHub Pages Deployment

1. Create a GitHub repository for the project
2. Push your code to the repository
3. Enable GitHub Pages in the repository settings:
   - Go to Settings > Pages
   - Set the source to "main" branch
   - Save changes
4. Your app will be available at "[https://yourusername.github.io/knightbot/`](https://ibramich3.github.io/KnightBot/)"

### Local Development

For local development:
1. Clone the repository
2. Open `index.html` in a browser
3. No build process is required as this is a pure JavaScript application

## Performance Considerations

### AI Performance

The minimax algorithm's performance is exponential with depth. To maintain good performance:

- Default depth is set to 3 (considering ~20 moves per position = 8,000 positions)
- Alpha-beta pruning significantly reduces the number of evaluated positions
- Position evaluation is optimized to avoid expensive calculations

### Browser Storage Limitations

Be aware of localStorage limitations:
- ~5MB storage limit per domain
- Stored data persists until explicitly cleared
- No expiration mechanism

### URL Length Limitations

When sharing games via URL:
- Most browsers support URLs up to 2,000 characters
- For longer game histories, consider using URL shortening services

## Future Enhancements

Potential technical enhancements include:

1. WebWorkers for AI calculations to prevent UI freezing
2. Implemented opening book for faster and stronger early game play
3. Backend integration for persistent storage and user accounts
4. WebSocket implementation for real-time multiplayer
5. Progressive Web App features for offline play 
