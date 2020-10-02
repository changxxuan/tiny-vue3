import { createApp } from "./src/runtime"
import App from "./src/App"
import { getCanvasRootContainer } from './src/application'

createApp(App).mount(getCanvasRootContainer())