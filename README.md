# tiny-vue3
编译时的优化  Vue3最大的特点


vite ，按需加载
现代浏览器都支持es6的import了

import xx from './a.js'，浏览器会发出一个网络请求

vite拦截这个请求，去做vue相关的编译，解析等，实现了按需加载的能力
不用打包
dev秒开，build走的是rollup


<!-- 
vite原理有啥用
    1. vue3配套的工具，下一代的脚手架工具
    2. 写一个vite，完整的掌握了vue3代码编译的流程（使用层面）
        如果你想做ssr，node段解析.vue -->

<!-- 还可以扩展其他中间件，比如支持ts，支持less-->


1. vue2也有静态标记 ，只能标记全量的静态
    v-if内部的静态节点
    <p id="xx" style="color：red">{{name}}</p>
    这个节点，只有child是动态, vue也会全量diff
    vue3只diff children

<!-- // compositionAPI：响应式+虚拟dom+模板编译+组件化

// @todo
// 1. 支持npm包的import
    // import xx from 'vue'替换成 import xx from '/@moduels/vue'
    // koa监听得到/modules/开头的网络请求，就去node_module里查找
// 2. 支持.vue单文件组件的解析
    // .vue文件浏览器是不认识的 对吧。浏览器import的时候只认识js
    // .vue单文佳年组建，拆成script， template
    // template=> render函数 拼成一个对象
    // script.render = render
// 3、 支持import css
// 比如热更新等 。ts支持等 -->