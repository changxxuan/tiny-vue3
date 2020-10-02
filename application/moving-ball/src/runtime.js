import { createRenderer } from "@vue/runtime-core"
import { Graphics } from "pixi.js"

const renderer = createRenderer({
    createElement(type){
        let element = undefined
        if(type === 'circle'){
            element = new Graphics()
            element.beginFill(0x00ff00, 1)
            element.drawCircle(0,0,20)
            element.endFill()
        }
        return element
    },
    insert(el, parent) {
        parent.addChild(el);
    },
    patchProp(el, key, prevValue, nextValue) {
        el[key] = nextValue;
    },
    parentNode() {},
    nextSibling() {},
})

export function createApp(rootComponent){
    return renderer.createApp(rootComponent)
}