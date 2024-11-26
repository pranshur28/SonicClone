import k from "./kaplayCtx.js";
import game from "./scenes/game.js";
import mainMenu from "./scenes/mainMenu";
import gameover from "./scenes/gameover.js";

// Load sprites
k.loadSprite("chemical-bg", "/graphics/chemical-bg.png");
k.loadSprite("platforms", "/graphics/platforms.png");
k.loadSprite("sonic", "/graphics/sonic.png", {
    sliceX: 8,
    sliceY: 2,
    anims: {
        run: { from: 0, to: 7, loop: true, speed: 30 },
        jump: { from: 8, to: 15, loop: true, speed: 100 },
    },
});
k.loadSprite("ring", "/graphics/ring.png", {
    sliceX: 16,
    sliceY: 1,
    anims: {
        spin: { from: 0, to: 15, loop: true, speed: 30 },
    },
});
k.loadSprite("motobug", "/graphics/motobug.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        run: { from: 0, to: 4, loop: true, speed: 8 }, 
    },
});

// Load sounds using kaplay 
k.loadSound("mainMenuSound", "/sounds/1.01 Title Screen.mp3");
k.loadSound("city", "/sounds/1.06 Green Hill Zone Act 1.mp3");
k.loadSound("destroy", "/sounds/Destroy.wav");
k.loadSound("hurt", "/sounds/Hurt.wav");
k.loadSound("hyperRing", "/sounds/HyperRing.wav");
k.loadSound("jump", "/sounds/Jump.wav");
k.loadSound("ring", "/sounds/Ring.wav");

// Load the "mania" font
k.loadFont("mania", "/fonts/mania.ttf");

// Load high scores from localStorage
const savedScores = localStorage.getItem('sonic-high-scores');
if (savedScores) {
    k.setData("high-scores", JSON.parse(savedScores));
}

k.scene("main-menu", mainMenu);

k.scene("game", game);

k.scene("gameover", gameover);

k.go("main-menu");
