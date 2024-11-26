import { makeSonic } from "../entities/sonic.js";
import k from "../kaplayCtx.js";

export default function mainMenu(){
    if (!k.getData("best-score")) k.setData("best-score", 0);
    
    const mainSFX = k.play("mainMenuSound", {volume: 0.3});
    
    k.onButtonPress("jump", () => {
        mainSFX.paused = true;
        k.go("game");
    });

    const bgPieceWidth = 1920;
    const bgPieces = 
    [
        k.add([k.sprite("chemical-bg"), k.pos(0,0), k.scale(2), k.opacity(0.8)]),
        k.add([k.sprite("chemical-bg"), k.pos(bgPieceWidth * 2,0), k.scale(2), k.opacity(0.8)]),
    ];

    const platformWidth = 1280;
    const platforms = [
        k.add([k.sprite("platforms"), k.pos(0,450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformWidth * 4, 450), k.scale(4)]),
    ];

    k.add([
        k.text("SONIC RING RUN", {font: "mania", size: 80}), 
        k.pos(k.center().x, 200),
        k.anchor("center"),
    ]);

    k.add([
        k.text("Press Space/W/Click/Touch to play",{font:"mania", size: 32}),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 200),
    ])

    makeSonic(k.vec2(200,745));
    k.onUpdate(() => {
        // Background scrolling logic
        if(bgPieces[1].pos.x < 0){
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        }
        bgPieces[0].move(-100,0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

        // Platform scrolling logic
        platforms.forEach((platform, index) => {
            platform.move(-4000, 0);
            if (platform.pos.x < -platformWidth * 4) {
                platform.moveTo(platforms[(index + 1) % platforms.length].pos.x + platformWidth * 4, 450);
            }
        });
    });
}
