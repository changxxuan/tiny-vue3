const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /': async (ctx, next) => {
        let content = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf-8')
        // 添加process变量，解决报错
        content = content.replace('<script', `
            <script>
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