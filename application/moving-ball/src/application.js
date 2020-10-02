import * as pixi from 'pixi.js'

const app = new pixi.Application({
    width: 400,
    height: 400
})
document.body.appendChild(app.view)

export function getCanvasRootContainer() {
    return app.stage;
}

export function getApplication() {
    return app;
}