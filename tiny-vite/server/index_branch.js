const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa()

app.use(ctx => {
    const {request: {url, query}} = ctx
    if(url === '/'){   // index.html
        console.log(path.resolve(__dirname, '../../src/index.html'))
        let content = fs.readFileSync(path.resolve(path.dirname(__dirname), 'index.html'), 'utf-8')
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
    }else if(url.endsWith('.js')){   // *.js (main.js)
        const filePath = path.resolve(path.dirname(__dirname), url.slice(1))
        ctx.response.type = 'application/javascript'
        ctx.response.body = rewriteImport(fs.readFileSync(filePath, 'utf-8'))
    }else if(url.startsWith('/@modules/')){
        const dir = path.join(path.dirname(__dirname), url.replace('/@modules', '/node_modules'))
        const packagePath = path.join(dir, 'package.json')
        const modulePath = require(packagePath).module  // const filePath = JSON.parse(fs.readFileSync(p, 'utf-8')).module
        const filePath = path.join(dir, modulePath)
        ctx.response.type = 'application/javascript'
        ctx.response.body = rewriteImport(fs.readFileSync(filePath, 'utf-8'))
    }else if(url.indexOf('.vue')>-1){
        const filePath = path.resolve(path.dirname(__dirname), url.slice(1).split('?')[0])
        const { descriptor } = compilerSfc.parse(fs.readFileSync(filePath, 'utf-8'))
        //console.log(descriptor)
        if(!query.type){
            ctx.response.type = 'application/javascript'
            ctx.response.body = `
${rewriteImport(descriptor.script.content.replace('export default ', 'const _script = '))}

import {render as _render} from '${url}?type=template'
_script.render = _render
export default _script
            `
        }else if(query.type === 'template'){
            const content = compilerDom.compile(descriptor.template.content,{mode:"module"}).code
            ctx.response.type = 'application/javascript'
            ctx.response.body = rewriteImport(content)
        }
    }else if(url.endsWith('.css')){
        const filePath = path.resolve(path.dirname(__dirname), url.slice(1))
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
//         ctx.response.body = `
// import { updateStyle } from "/vite/client"
// const css = ${rewriteImport(content)}
// updateStyle("\"2418ba23\"", css)
// export default css
//         ${rewriteImport(content)}
//         `
    }
})

app.listen(8080, () => {
    console.log('listening 8080...')
})

// 目的是改造.js文件内容， 不是/ ./ ../开头的import，替换成/@modules/开头的
function rewriteImport(content){
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function($0, $1){
        if(!$1.match(/^.{0,2}\//g)){
            return ` from '/@modules/${$1}'`
        }else{
            return $0
        }
    })
}