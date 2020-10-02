<template>
  <div>
    <h2>当前鼠标位置</h2>
    <h3>X: {{x}}, Y: {{y}}</h3>
    <input type="text" v-model="state.value" @keyup.enter.native="addTodo">
    <ul v-for="todo in state.todos" :key="todo.name">{{todo.name}}</ul>
    total: {{total}}
  </div>
</template>

<script>
import useAddTodo from './modules/useAddTodo'
import useMouse from './modules/useMouse'
//import test from './modules/test'

export default {
  name: 'App',
  setup(){
    let { state, total, addTodo } = useAddTodo()
    let { x, y } = useMouse()
    //test()
    return {
      state, total, addTodo,
      x, y
    }
  }
}
</script>
