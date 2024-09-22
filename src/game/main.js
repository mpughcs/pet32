import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';

// Function to get the appropriate game size based on window size
const calculateGameSize = () => {
    const aspectRatio = 4 / 3; // Desired aspect ratio (you can change it)
    let width = window.innerWidth * 0.8;  // 80% of the available width
    let height = width / aspectRatio;     // Calculate height based on the aspect ratio

    // If the calculated height exceeds window.innerHeight, adjust the width and height accordingly
    if (height > window.innerHeight * 0.8) {
        height = window.innerHeight * 0.8;
        width = height * aspectRatio;
    }

    return { width, height };
};

// Set up game configuration
const config = {
    type: AUTO,
    backgroundColor: '#FFFFFF',
    parent: 'game-container',
    scene: [MainGame],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Create a new game instance with responsive sizing
const StartGame = (parent) => {
    const { width, height } = calculateGameSize();
    return new Game({
        ...config,
        width,    // Set width dynamically
        height,   // Set height dynamically
        parent
    });
};

// Listen to window resize events and adjust the game size
window.addEventListener('resize', () => {
    const { width, height } = calculateGameSize();
    game.scale.resize(width, height);
});

export default StartGame;
