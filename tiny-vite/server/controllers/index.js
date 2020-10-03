const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /': async (ctx, next) => {
        let content = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8')
        // 添加process变量，解决报错
        content = content.replace('<script', `
            <script>
                //@todo
                // 注入一个socket客户端
                // 后端的文件变了，通知前端去更新(热更新)
                window.process = {
                    env: {NODE_EV:'dev'}
                }
            </script>
            <script
        `)
        ctx.response.type = 'text/html'  // ctx.response <--> ctx
        ctx.response.body = content
    }
}