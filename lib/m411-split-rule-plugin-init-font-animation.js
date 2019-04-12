const bus = require('@gotoeasy/bus');

// 查找字体和动画属性，设定到POSTCSS的AST节点中去，方便后续插件读取判断
bus.on('split-plugins', function fnPlugin(root, result) {

    root.walkDecls( decl => {

        if ( /^font-family$/i.test(decl.prop) ) {
            // 用font-family指定字体名
            decl.parent.fontNames = decl.parent.fontNames || [];
            decl.parent.fontNames.push(decl.value);
        }else if ( /^font$/i.test(decl.prop) ) {
            // 用font指定字体名
            let fontNames = [];
            let ary = decl.value.replace(/;/g, '').split(/\s*,\s*/);            // font: normal normal normal 14px/1 nnn; font: normal normal normal 14px/1 nnn, mmm; font: nnn, mmm;
            let tmps = ary[0].split(/\s+/);
            fontNames.push(tmps.pop());                                         // font: normal normal normal 14px/1 nnn, mmm; => nnn

            for ( let i=1; i<ary.length; i++ ) {
                fontNames.push(ary[i]);                                         // font: normal normal normal 14px/1 nnn, mmm; => mmm
            }

            if ( fontNames.length ) {
                decl.parent.fontNames = decl.parent.fontNames || [];
                decl.parent.fontNames.push(...fontNames);
            }

        }else if ( /^animation-name$/i.test(decl.prop) ) {
            // 用font-family指定动画名
            decl.parent.animation = decl.value;
        }else if ( /^animation$/i.test(decl.prop) ) {
            // 用font-family指定字体名
            decl.parent.animation = decl.value.split(' ')[0];
        }

    });

});
