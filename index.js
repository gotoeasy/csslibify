const npm = require('@gotoeasy/npm');
const bus = require('@gotoeasy/bus');

// 自动装载lib目录下的全部模块
npm.requireAll(__dirname, 'lib/**.js');

module.exports = (function(oLibs={}) {

    // -----------------------------------------------------------------
    // pkg  : 样式库实际哈希用的名称，通常是包名，含特殊字符时将被转换
    // name : 样式库名称，通常是包名简写，用于简便指定样式库
    // id   : 样式库实例缓存用id，通常由【包名+文件列表】确定，默认不缓存
    // -----------------------------------------------------------------
    return function(pkg='', name='', id) {

        pkg = pkg.replace(/[@\*]/ig, '').replace(/[^a-zA-Z0-9\-_/]/g, '-');         // @scope/name => scope-name

        if ( id && oLibs[id] ){
            let rs = oLibs[id];
            if ( rs.name !== name ){
                rs = Object.assign({}, rs);                                         // 库名不一样时，浅复制实例修改库名(包名已被作为哈希条件哈希到id中，应该一样，可以忽略)
                rs.name = name;
            }
            return rs;
        } 

        // -------------------------------------------------------------
        // 能自动判别避免重复导入影响性能
        // 
        // fileOrCss        : 样式文件或内容 （必须输入）
        // opt.basePath     : 样式所在目录 （文件时默认为文件所在目录）
        // opt.assetsPath   : 修改后的url资源目录 （默认使用资源复制后的绝对路径）
        // -------------------------------------------------------------
        let imp = bus.on('import-css-to-lib')[0];                                   // 导入到样式库

        // -------------------------------------------------------------
        // ...args              : 要引用的标签名或样式类名或选项
        // -------------------------------------------------------------
        let get = bus.on('get-relative-css')[0];                                    // 从样式库按需引用

        let csslib = { name, pkg, imp, get, _imported: [] };                        // _imported为空数组时表示没有导入过
        id && (oLibs[id] = csslib);
        return csslib;
    };

})();
