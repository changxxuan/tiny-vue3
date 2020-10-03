const Koa = require('koa')
const controller = require('./controller');
const rewriteImport = require('./rewriteImport');

const app = new Koa()

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

app.use(rewriteImport())

app.use(controller())

app.listen(8080, () => {
    console.log('listening 8080...')
})