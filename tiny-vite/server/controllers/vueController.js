const fs = require('fs');
const path = require('path')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

module.exports = {
    'GET /src/App.vue': async (ctx, next) => {
        const {request: {url, query}} = ctx
        const filePath = path.join(__dirname, '../../', url.split('?')[0])
        // import xx from 'xx.vue'
        // 1. 单文件组件解析，需要官方的库 @vue/compiler-sfc
        const { descriptor } = compilerSfc.parse(fs.readFileSync(filePath, 'utf-8'))
        //console.log(descriptor)
        if(!query.type){
            ctx.response.type = 'application/javascript'
            // 3. 拼成对象，_script.render = _render
            ctx.response.body = `
${ctx.rewriteImport(descriptor.script.content.replace('export default ', 'const _script = '))}

import {render as _render} from '${url}?type=template'
_script.render = _render
export default _script
            `
        }else if(query.type === 'template'){
            // 2. @vue/compiler-dom解析template，变成render函数
            const content = compilerDom.compile(descriptor.template.content,{mode:"module"}).code
            ctx.response.type = 'application/javascript'
            ctx.response.body = ctx.rewriteImport(content)
        }
        await next()
    },
    'GET /@modules/g': async (ctx, next) => {
        // node_module中查找
        const {request: {url, query}} = ctx
        const dir = path.join(__dirname, '../../', url.replace('/@modules', '/node_modules'))
        const packagePath = path.join(dir, 'package.json')
        const modulePath = require(packagePath).module  // const filePath = JSON.parse(fs.readFileSync(p, 'utf-8')).module
        const filePath = path.join(dir, modulePath)
        ctx.response.type = 'application/javascript'
        ctx.response.body = ctx.rewriteImport(fs.readFileSync(filePath, 'utf-8'))
        await next()
    }
}