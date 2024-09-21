import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: AUTO,
    width: 1024*.8,
    height: 768*.8,
    // resizeToParent: true,

    parent: 'game-container',
    scene: [
        MainGame
    ],
    backgroundColor: '#FFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;

