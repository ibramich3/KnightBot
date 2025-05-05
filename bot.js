const { Client, GatewayIntentBits, Events } = require('discord.js');
const config = require('./config.js');
const { Chess } = require('chess.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

// Game instances for different channels
const games = new Map();

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    const args = message.content.toLowerCase().split(' ');
    const command = args.shift();

    if (command === '!chess') {
        const subCommand = args[0];

        switch (subCommand) {
            case 'start':
                if (!games.has(message.channelId)) {
                    const game = new Chess();
                    games.set(message.channelId, game);
                    await message.reply('New chess game started! Use !chess move <from> <to> to play (e.g., !chess move e2 e4)');
                    await displayBoard(message.channel, game);
                } else {
                    await message.reply('A game is already in progress in this channel!');
                }
                break;

            case 'move':
                const game = games.get(message.channelId);
                if (!game) {
                    await message.reply('No game in progress. Start one with !chess start');
                    return;
                }

                const [from, to] = args.slice(1);
                try {
                    game.move({ from, to });
                    await displayBoard(message.channel, game);
                    
                    if (game.isGameOver()) {
                        let result = 'Game Over! ';
                        if (game.isCheckmate()) result += 'Checkmate!';
                        else if (game.isDraw()) result += 'Draw!';
                        await message.channel.send(result);
                        games.delete(message.channelId);
                    } else {
                        // AI move
                        makeAIMove(game);
                        await displayBoard(message.channel, game);
                        
                        if (game.isGameOver()) {
                            let result = 'Game Over! ';
                            if (game.isCheckmate()) result += 'Checkmate!';
                            else if (game.isDraw()) result += 'Draw!';
                            await message.channel.send(result);
                            games.delete(message.channelId);
                        }
                    }
                } catch (error) {
                    await message.reply('Invalid move! Please use standard chess notation (e.g., !chess move e2 e4)');
                }
                                break;

            case 'resign':
                if (games.delete(message.channelId)) {
                    await message.reply('Game resigned. Start a new game with !chess start');
        } else {
                    await message.reply('No game in progress.');
                }
                break;

            default:
                await message.reply('Available commands: !chess start, !chess move <from> <to>, !chess resign');
        }
    }
});

async function displayBoard(channel, game) {
    const board = game.board();
    let boardDisplay = '```\n  a b c d e f g h\n';
    for (let i = 0; i < 8; i++) {
        boardDisplay += (8 - i) + ' ';
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            boardDisplay += (piece ? piece.type.toUpperCase() : '.') + ' ';
        }
        boardDisplay += (8 - i) + '\n';
    }
    boardDisplay += '  a b c d e f g h\n```';
    await channel.send(boardDisplay);
}

function makeAIMove(game) {
    const moves = game.moves({ verbose: true });
    if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        game.move(move);
    }
}

client.login(config.token);
