import k from "../kaplayCtx.js";

export function makeRing(position) {
    return k.add([
        k.sprite("ring", {anim: "spin" }),
        k.pos(position),
        k.scale(4),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
        k.offscreen(),
        "ring",
    ]);
}
