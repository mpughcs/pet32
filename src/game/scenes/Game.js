import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.duckSpeed = 100; // Adjust speed as needed
        this.movementDuration = 2000; // Duration to move in ms
        this.pauseDuration = 5000; // Pause duration in ms
        this.foodLocations = []
        this.frameRate = 9;
    }

    preload() {
        this.load.setPath('assets');
        // Load the background and sprite sheet
        this.load.image('bread', 'bread.png');
        this.load.image('hotdog', 'hotdog.png');
        this.load.image('background', 'farm.jpg');
        this.load.spritesheet('duckIdle', 'duckyIdle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('duckWalk', 'duckywalk.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('duckWalkUp', 'duckywalkup.png', { frameWidth: 128, frameHeight: 128 });
    }

    create() {
        // Set background to fill the entire canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // Add the duck sprite with physics
        this.duck = this.physics.add.sprite(400, 300, 'duckIdle');
        // this.duck.setScale(.8); // Scale the sprite to fit

        // Create a walking animation
        this.anims.create({
            key: 'walk', // The key to reference this animation
            frames: this.anims.generateFrameNumbers('duckWalk', { start: 0, end: 8 }), // Adjust frame range based on your sprite sheet
            frameRate: this.frameRate, // Speed of the animation
            repeat: -1 // Loop the animation indefinitely
        });

        this.anims.create({
            key: 'duckWalkUp',
            frames: this.anims.generateFrameNumbers('duckWalkUp', { start: 0, end: 8 }),
            frameRate: this.frameRate,
            repeat: -1
        });

        // Create the food group with physics enabled
        this.foodGroup = this.physics.add.group();

        // Start the random movement logic
        this.randomMovement();

        // Emit event once the scene is ready
        EventBus.emit('current-scene-ready', this);

        // Add collision detection between duck and food
        this.physics.add.overlap(this.duck, this.foodGroup, this.collectFood, null, this);
    }

    randomMovement() {
        let anim = 'walk';
        // Play the 'walk' animation on the duck sprite

        // Set random new position
        let newX = 0;
        let newY = 0;

        if (this.foodLocations.length > 0) {
            const randomIndex = Phaser.Math.Between(0, this.foodLocations.length - 1);
            newX = this.foodLocations[randomIndex].x;
            newY = this.foodLocations[randomIndex].y;
        } else {

            newX = Phaser.Math.Between(0 + this.duck.width / 2, this.sys.game.config.width - this.duck.width / 2);
            newY = Phaser.Math.Between(0 + this.duck.height / 2, this.sys.game.config.height - this.duck.height / 2);
        }
        const currentX = this.duck.x;
        const currentY = this.duck.y;

        // i want the duck to be bigger the higher the y value


        if (newX > currentX) {
            this.duck.flipX = true;
        } else {
            this.duck.flipX = false;
        }

        if (newY < currentY && newX < currentX) {
            anim = 'duckWalkUp';
        } else {
            anim = 'walk';
        }
        this.duck.play(anim);

        let distance = Phaser.Math.Distance.Between(currentX, currentY, newX, newY);
        let duration = distance / this.duckSpeed * 1000;

        // Move the duck to the new position over time
        this.tweens.add({
            targets: this.duck,
            x: newX,
            y: newY,
            duration: duration, // Adjust movement duration as needed
            onComplete: () => {
                // When movement is complete, take a break
                this.duckStop();
            }
        });
    }

    duckStop() {
        // Stop the animation to simulate a pause
        this.duck.anims.stop();
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('duckIdle', { start: 0, end: 8 }),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.duck.play('idle');

        // Random delay for the pause before moving again
        this.time.delayedCall(this.pauseDuration, () => {
            // Resume walking animation and start moving to a new random position
            this.randomMovement();
        });
    }

    addRandomSprite() {
        const x = Phaser.Math.Between(64, this.sys.game.config.width - 64);
        const y = Phaser.Math.Between(64, this.sys.game.config.height - 64);
        this.foodLocations.push({ x, y });

        // Add the food with physics enabled
        let food;
        let randomSprite = Phaser.Math.Between(0, 1);
        if (randomSprite === 0) {
            food = this.foodGroup.create(x, y, 'bread');
        } else {
            food = this.foodGroup.create(x, y, 'hotdog');
        }

        // Optionally adjust the food size
        food.setScale(0.7);
    }
    update() {
        // Call the method to scale the duck based on its Y position
        this.scaleDuckBasedOnY();
    }

    scaleDuckBasedOnY() {
        const screenHeight = this.sys.game.config.height;
        const minScale = 0.2;  // The scale at the top of the screen
        const maxScale = 1.5;  // The scale at the bottom of the screen

        // Normalize Y position to a 0-1 range and interpolate between min and max scale
        const scaleFactor = Phaser.Math.Interpolation.Linear([minScale, maxScale], this.duck.y / screenHeight);
        this.duck.setScale(scaleFactor);
    }
    collectFood(duck, food) {
        // Remove the food sprite from the game
        food.destroy();

        // Find and remove the corresponding food location from the array
        const index = this.foodLocations.findIndex(location =>
            location.x === food.x && location.y === food.y
        );
        if (index !== -1) {
            this.foodLocations.splice(index, 1);
        }

        // Optionally, you can emit an event or update score here
        console.log(this.foodLocations);
        console.log('Food collected!');
    }
}
