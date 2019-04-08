const npm = require('@gotoeasy/npm');
const bus = require('@gotoeasy/bus');

// 自动装载lib目录下的全部模块
npm.requireAll(__dirname, 'lib/**.js');

module.exports = (function(oLibs={}) {

    // -----------------------------------------------------------------
    // pkg : 样式库实际哈希用的名称，通常是包名，含特殊字符时将被转换
    // name: 样式库名称，通常是包名简写，用于缓存样式库实例，默认无名称不缓存
    // -----------------------------------------------------------------
    return function(pkg='', name='') {

        if ( name && oLibs[name] ) return oLibs[name];

        // -------------------------------------------------------------
        // 能自动判别避免重复导入影响性能
        // 
        // fileOrCss            : 样式文件或内容 （必须输入）
        // opt.basePath         : 样式所在目录 （文件时默认为文件所在目录）
        // opt.assetsPath       : 修改后的url资源目录 （默认复制资源后使用该资源的绝对路径）
        // -------------------------------------------------------------
        let imp = bus.on('import-css-to-lib')[0];        // 导入到样式库

        // -------------------------------------------------------------
        // ...args              : 要引用的标签名或样式类名或选项
        // -------------------------------------------------------------
        let get = bus.on('get-relative-css')[0];         // 从样式库按需引用

        pkg = pkg.replace(/@/ig, '').replace(/[^a-zA-Z0-9\-_/]/g, '-');       // @scope/name => scope-name
        let csslib = { name, pkg, imp, get, nodes: [], _imported: [] };
        name && (oLibs[name] = csslib);
        return csslib;
    };

})();
