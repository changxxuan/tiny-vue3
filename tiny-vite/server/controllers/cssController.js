const fs = require('fs')
const path = require('path')

module.exports = {
    'GET /src/index.css': async (ctx, next) => {
        const {request: {url, query}} = ctx
        const filePath = path.join(__dirname, '../../', url)
        let content = fs.readFileSync(filePath, 'utf-8')
        content = 
`
    let css = "${content.replace(/\r?\n */g, '')}"
    let link = document.createElement('style')
    link.setAttribute('type', 'text/css')
    document.head.appendChild(link)
    link.innerHTML = css
    export default css
        `
        ctx.response.type = 'application/javascript'
        ctx.response.body = content
    }
}