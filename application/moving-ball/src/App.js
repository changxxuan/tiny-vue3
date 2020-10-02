import { defineComponent, h, reactive, onMounted, onUnmounted } from "@vue/runtime-core"
import { getApplication } from './application'

export default defineComponent({
    setup(){
        const initX = 30, initY = 200
        const app = getApplication()
        const location = reactive({
            x: initX,
            y: initY
        })
        const move = () => {
            const speed = 5;
            location.x += speed;
            if(location.x >= 400){
                location.x = initX
            }
          };
        onMounted(()=>{
            app.ticker.add(move)
        })
        onUnmounted(()=>{
            app.ticker.remove(move)
        })
        return {
            location
        }
    },
    render(ctx){
        const vnode = h("circle", {x: ctx.location.x, y: ctx.location.y})
        return vnode
    }
})