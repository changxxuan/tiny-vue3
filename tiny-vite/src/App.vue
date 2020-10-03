<template>
    <div>               
        <h3>{{count}}</h3>
        <button @click="add">add</button>
    </div>
</template>

<script>
export default {
    data(){
        return {
            count: 1
        }
    },
    methods: {
        add(){
            this.count += 1
        }
    }

}
</script>