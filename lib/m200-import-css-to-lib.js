const bus = require('@gotoeasy/bus');
const File = require('@gotoeasy/file');
const hash = require('@gotoeasy/hash');
const postcss = require('postcss');

// -----------------------------------------------------------------------------------------
// fileOrCss            : 样式文件或内容 （必须输入）
// opt.basePath         : 内容时传入样式所在目录 （文件时默认为文件所在目录，内容时默认当前目录）
// -----------------------------------------------------------------------------------------
module.exports = bus.on('import-css-to-lib', function(){

	return function imp(fileOrCss, opt={}){

        let cache = bus.at('cache');
        let inputCss = File.existsFile(fileOrCss) ? File.read(fileOrCss) : fileOrCss;

        let fromPath = File.existsFile(fileOrCss) ? File.resolve(process.cwd(), File.path(fileOrCss)) : ( opt.basePath || './' );
        let toPath = this.basePath;                             // 资源复制目录
        let assetsPath = toPath;                                // 传入绝对路径，自动计算相对目录resources
        let cacheKey = hash( JSON.stringify(['import-css-to-lib', inputCss, 'fromPath:' + fromPath, 'assetsPath:' + assetsPath]) );

        // -------------------------------------------------------
        // 有缓存则直接使用
        let cacheValue = cache.get(cacheKey);
        if ( cacheValue ) {
            if ( !this._imported.includes(cacheKey) ) {   // 避免重复导入
                let oJson = cacheValue;
                if ( oJson.fonts ) {
                    (oJson.fonts || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template));   // 添加toString方法
                    this.fonts = merge(this.fonts, oJson.fonts);
                }
                if ( oJson.keyframes ) {
                    (oJson.keyframes || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template, node.animation));   // 添加toString方法
                    this.keyframes = merge(this.keyframes, oJson.keyframes);
                }
                if ( oJson.nodes ) {
                    (oJson.nodes || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template, ...(node.classes||[]), node.animation ));   // 添加toString方法
                    this.nodes = merge(this.nodes, oJson.nodes);
                }
                if ( oJson.atpages ) {
                    (oJson.atpages || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template ));   // 添加toString方法
                    this.atpages = merge(this.atpages, oJson.atpages);
                }
            }

            return this;
        }
        // -------------------------------------------------------


        // 整理输入样式
        let css = bus.at('normalize-input-css', inputCss, fromPath, toPath, assetsPath);

        // 使用插件方式处理
        let processResult = {nodes:[]};
        bus.at('process-result-of-split-postcss-plugins', processResult);   // 重置处理结果
        let rs = postcss( bus.at('get-split-postcss-plugins') ).process(css, {from: File.resolve(toPath, 'from.css')}).sync().root.toResult();

        // 取出处理结果
        processResult.fonts && (this.fonts = merge(this.fonts, processResult.fonts));
        processResult.keyframes && (this.keyframes = merge(this.keyframes, processResult.keyframes));
        processResult.atpages && (this.atpages = merge(this.atpages, processResult.atpages));  // 导入的nodes加到当前库nodes中，重复则不加
        processResult.nodes && (this.nodes = merge(this.nodes, processResult.nodes));

        if ( rs.css ) {
            let filetodo = `${cache.path}/todo/todo.css`;
            File.write( filetodo, rs.css);   // 写文件便于确认
            console.log('[csslibify-todo]', filetodo);
        }
        cache.set(cacheKey, processResult);

        this._imported.push(cacheKey);
        return this;
    }

}());


function merge(nodes1=[], nodes2=[]){
    let oSet = new Set();
    nodes1.forEach(n => oSet.add(JSON.stringify(n)));
    nodes2.forEach(n => {
        let cd = JSON.stringify(n);
        !oSet.has(cd) && oSet.add(cd) && nodes1.push(n);
    });
    return nodes1;
}