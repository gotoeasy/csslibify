const bus = require('@gotoeasy/bus');

// 查找动画属性，设定到POSTCSS的AST节点中去，方便后续插件读取判断
bus.on('split-plugins', function fnPlugin(root, result) {

    root.walkDecls( decl => {

        if ( /^font-family$/i.test(decl.prop) ) {
            decl.parent.fontFamily = decl.value;
        }else if ( /^animation-name$/i.test(decl.prop) ) {
            decl.parent.animation = decl.value;
        }else if ( /^animation$/i.test(decl.prop) ) {
            decl.parent.animation = decl.value.split(' ')[0];
        }
    });

});
