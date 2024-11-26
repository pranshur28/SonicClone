import { makeMotobug } from "../entities/motobug.js";
import { makeRing } from "../entities/ring.js";
import { makeSonic } from "../entities/sonic.js";
import k from "../kaplayCtx.js"
import mainMenu from "./mainMenu.js";
export default function game(){

    // Load high scores from localStorage if they exist
    const savedHighScores = localStorage.getItem('sonic-high-scores');
    if (savedHighScores) {
        k.setData("high-scores", JSON.parse(savedHighScores));
    }

    k.setGravity(3100);
    const  citySFX = k.play("city", {volume: 0.3})

    const bgPieceWidth = 1920;
    const bgPieces = 
    [
        k.add([k.sprite("chemical-bg"), k.pos(0,0), k.scale(2), k.opacity(0.8)]),
        k.add([k.sprite("chemical-bg"), k.pos(bgPieceWidth * 2,0) , k.scale(2), k.opacity(0.8)]),
    ];

    const platformWidth = 1280;
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0,450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformWidth , 450), k.scale(4)]),
    ];

    let score = 0;
    const gameState = {
        scoreMultiplier: 0
    };

    const scoreText = k.add(
        [
            k.text("SCORE : 0", {font: "mania", size: 72 }),
            k.pos(20,20),
        ]
    )
    const sonic = makeSonic(k.vec2(200,745), gameState);
    sonic.setControls();
    sonic.setEvents();
    sonic.onCollide("enemy", (enemy) => {
        if (!sonic.isGrounded()){
            k.play("destroy", {volume: 0.3});
            k.play("hyperRing",{volume: 0.3});
            k.destroy(enemy);
            sonic.play("jump");
            sonic.jump();
            gameState.scoreMultiplier += 1;
            score += 10 * gameState.scoreMultiplier;
            scoreText.text = `SCORE: ${score}`;
            if (gameState.scoreMultiplier === 1) sonic.ringCollectUI.text = "+10";
            if (gameState.scoreMultiplier > 1) sonic.ringCollectUI.text = `x${gameState.scoreMultiplier}`
            k.wait(1, () => {
                sonic.ringCollectUI.text = "";
            });

            return;
        }

        k.play("hurt",{ volume: 0.3 });
        k.setData("current-score", score);
        // Save high scores to localStorage before going to gameover scene
        const highScores = k.getData("high-scores") || [];
        localStorage.setItem('sonic-high-scores', JSON.stringify(highScores));
        k.go("gameover", {citySFX});
        
    });
    sonic.onCollide("ring", (ring) =>{
        k.play("ring", {volume: 0.3});
        k.destroy(ring); 
        score++;
        scoreText.text = `SCORE: ${score}`;
        sonic.ringCollectUI.text = "+1";
        k.wait(1, () => {
            sonic.ringCollectUI.text = "";
        });
        
    });

    let gameSpeed = 300;
    k.loop(1, () => { 
        gameSpeed += 100;            
    });

    const spawnMotoBug = () => {
        const motobug = makeMotobug(k.vec2(1950,773));
        motobug.onUpdate(() => {
            if ( gameSpeed < 3000 ){
                motobug.move(-(gameSpeed + 300),0 );
                return;
            }
            motobug.move(-gameSpeed, 0);

        });

        motobug.onExitScreen(() => {
            if ( motobug.pos.x < 0 ) k.destroy(motobug);
        });

const waitTime = k.rand(0.5 , 2.5);
k.wait(waitTime, spawnMotoBug);

    };

    spawnMotoBug();

    const spawnRing = () => {
        const ring = makeRing(k.vec2(1950, 745));
        ring.onUpdate(() => {
            ring.move(-gameSpeed,0);
        });
        ring.onExitScreen(() =>{
            if(ring.pos.x < 0) k.destroy(ring);
        });

        const waitTime = k.rand(0.5, 3);

        k.wait(waitTime, spawnRing);
    };

    spawnRing();

    k.add(
        [
            k.rect(1920, 300),
            k.opacity(0),
            k.area(),
            k.pos(0, 832),
            k.body({isStatic: true}),
        ]);

    const GROUND_Y = 745; // Sonic's initial y position
    const MAX_PARALLAX_OFFSET = 150; // Maximum background offset

    k.onUpdate(() => {
        // Calculate parallax offset based on Sonic's height from ground
        const heightFromGround = GROUND_Y - sonic.pos.y;
        const parallaxOffset = Math.min(heightFromGround * 0.2, MAX_PARALLAX_OFFSET);

        // Update background pieces with parallax effect
        bgPieces.forEach((bgPiece, index) => {
            // Horizontal movement
            bgPiece.move(-100, 0);
            if (bgPiece.pos.x < -bgPieceWidth * 2) {
                bgPiece.moveTo(bgPieces[(index + 1) % bgPieces.length].pos.x + bgPieceWidth * 2, parallaxOffset);
            }
            
            // Smooth vertical parallax movement
            const targetY = parallaxOffset;
            const currentY = bgPiece.pos.y;
            const smoothY = k.lerp(currentY, targetY, 0.1);
            bgPiece.moveTo(bgPiece.pos.x, smoothY);
        });

        // Update platforms
        platforms.forEach((platform, index) => {
            platform.move(-gameSpeed, 0);
            if (platform.pos.x < -platformWidth * 4) {
                const nextIndex = (index + 1) % platforms.length;
                platform.moveTo(platforms[nextIndex].pos.x + platformWidth * 4, 450);
            }
        });
    });
}
