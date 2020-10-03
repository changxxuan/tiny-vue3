const fs = require('fs');
const path = require('path')

module.exports = {
    'GET /src/main.js': async (ctx, next) => {
        const {request: {url, query}} = ctx
        const filePath = path.join(__dirname, '../../', url)
        ctx.response.type = 'application/javascript'
        console.log(ctx.rewriteImport(fs.readFileSync(filePath, 'utf-8')))
        ctx.response.body = ctx.rewriteImport(fs.readFileSync(filePath, 'utf-8'))
    }
}