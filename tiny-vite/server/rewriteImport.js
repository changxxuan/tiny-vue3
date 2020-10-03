// 目的是改造.js文件内容， 不是/ ./ ../开头的import，替换成/@modules/开头的

function rewriteImport() {
    return async (ctx, next) => {
        ctx.rewriteImport = function (content) {
            return content.replace(/ from ['|"]([^'"]+)['|"]/g, function($0, $1){
                if(!$1.match(/^.{0,2}\//g)){
                    return ` from '/@modules/${$1}'`
                }else{
                    return $0
                }
            })
        }
        await next();
    };
}

module.exports = rewriteImport;