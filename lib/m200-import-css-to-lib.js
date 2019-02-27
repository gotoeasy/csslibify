const bus = require('@gotoeasy/bus');
const File = require('@gotoeasy/file');
const hash = require('@gotoeasy/hash');
const postcss = require('postcss');

// -------------------------------------------------------------
// fileOrCss            : 样式文件或内容 （必须输入）
// opt.basePath         : 样式所在目录 （文件时默认为文件所在目录，内容时默认当前目录）
// opt.assetsPath       : 修改后的url资源目录 （默认复制资源后使用该资源的绝对路径）
module.exports = bus.on('import-css-to-lib', function(){

	return function imp(fileOrCss, opt={}){

        let inputCss = File.existsFile(fileOrCss) ? File.read(fileOrCss) : fileOrCss;
        let hashcode = hash( inputCss + 'basePath:' + (opt.basePath || '') + 'assetsPath:' + (opt.assetsPath || '') );
        let csslibfile = `${bus.at('get-cache-path')}/imp-${hashcode}.json`;

        // -------------------------------------------------------
        // 有缓存文件则直接使用
        if ( File.existsFile(csslibfile) ) {
            let oJson = JSON.parse(File.read(csslibfile));
            if ( oJson.fonts ) {
                (oJson.fonts || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template));   // 添加toString方法
                this.fonts = merge(this.fonts, oJson.fonts);
                this.fonts.sort();
            }
            if ( oJson.keyframes ) {
                (oJson.keyframes || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template, node.animation));   // 添加toString方法
                this.keyframes = merge(this.keyframes, oJson.keyframes);
                this.keyframes.sort();
            }
            if ( oJson.nodes ) {
                (oJson.nodes || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template, ...(node.classes||[]), node.animation ));   // 添加toString方法
                this.nodes = merge(this.nodes, oJson.nodes);
                this.nodes.sort();
            }
            if ( oJson.atpages ) {
                (oJson.atpages || []).forEach(node => node.toString = bus.at('template-to-tostring', node.template ));   // 添加toString方法
                this.atpages = merge(this.atpages, oJson.atpages);
                this.atpages.sort();
            }
            return this;
        }
        // -------------------------------------------------------

        let fromPath = File.existsFile(fileOrCss) ? File.resolve(process.cwd(), File.path(fileOrCss)) : ( opt.basePath || './' );
        let toPath = File.path(csslibfile);
        let assetsPath = opt.assetsPath || toPath;

        // 整理输入样式
        let css = bus.at('normalize-input-css', inputCss, fromPath, toPath, assetsPath);

        // 使用插件方式处理
        let processResult = {nodes:[]};
        bus.at('process-result-of-split-postcss-plugins', processResult); // 重置处理结果
        let rs = postcss( bus.at('get-split-postcss-plugins') ).process(css, {from: File.resolve(toPath, 'from.css')}).sync().root.toResult();

        // 取出处理结果
        processResult.fonts && (this.fonts = merge(this.fonts, processResult.fonts)) && this.fonts.sort();
        processResult.keyframes && (this.keyframes = merge(this.keyframes, processResult.keyframes)) && this.keyframes.sort();
        processResult.atpages && (this.atpages = merge(this.atpages, processResult.atpages)) && this.atpages.sort();  // 导入的nodes加到当前库nodes中，重复则不加
        processResult.nodes && (this.nodes = merge(this.nodes, processResult.nodes)) && this.nodes.sort();  // 导入的nodes加到当前库nodes中，重复则不加

        // ----------------------------------
        if ( rs.css ) {
            let tmp = [];
            this.nodes.forEach(node => tmp.push(node.toString('',(p,n)=>n)));
            File.write(csslibfile.replace('.json','-finish.css'), tmp.join('\n'));
            File.write(csslibfile.replace('.json','-todo.css'), rs.css);
        }
        File.write(csslibfile, JSON.stringify(processResult, null, 2));
        // ----------------------------------

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