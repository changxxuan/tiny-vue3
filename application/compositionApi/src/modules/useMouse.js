import { ref, onMounted, onUnmounted } from 'vue'
function useMouse(){
    const x = ref(0)
    const y = ref(0)

    function updateLocation(e){
        x.value = e.pageX
        y.value = e.pageY
    }

    onMounted(()=>{
        window.addEventListener('mousemove', updateLocation)
    })

    onUnmounted(()=>{
        window.removeEventListener('mousemove', updateLocation)
    })

    return { x, y }
}
export default useMouse