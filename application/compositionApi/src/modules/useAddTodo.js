import { reactive, computed } from 'vue'
function useAddTodo(){
    const state = reactive({
        todos: [
            {name: 'learning', done: false}, 
            {name: 'shopping', done: false}
        ],
        value: ''
    })
    const total = computed(()=>state.todos.length)
    function addTodo(){
        state.todos.push({
            name: state.value,
            done: false
        })
        state.value = ''
    }
    return {
        state,
        total,
        addTodo
    }
}
export default useAddTodo