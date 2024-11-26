import k from "../kaplayCtx.js"
export function makeSonic(pos, gameState){
    const sonic = k.add([
        k.sprite("sonic", {anim: "run"}),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.body({jumpForce: 1700}),
        
        {  
            ringCollectUI: null,
            setControls () {
                k.onButtonPress("jump", ()=>{
                    if(this.isGrounded()) {
                        this.play("jump"); 
                        this.jump();
                    k.play("jump",{ volume: 0.3 });
                    }
                });
            },
            setEvents() {
                this.onGround(() =>{
                    this.play("run");
                    gameState.scoreMultiplier = 0;
                });

            },
        },

    ]);

    sonic.ringCollectUI = sonic.add([
        k.text("", {font: "mania", size: 24 } ),
        k.color(255,255,0),
        k.anchor("center"),
        k.pos(30,-10),
    ]);

    return sonic;

}
