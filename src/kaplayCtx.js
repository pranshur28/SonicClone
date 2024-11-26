import kaplay from "kaplay";

const k = kaplay({
    width: 1920,
    height: 1080,
    letterbox: true,
    background: [0,0,0],
    global: false,
    touchToMouse: true,
    buttons: {
        jump: {
            keyboard: ["space","up","w"],
            mouse: "left",
        },
    },
    debugKey: "d",
    debug: false,
});

export default k;