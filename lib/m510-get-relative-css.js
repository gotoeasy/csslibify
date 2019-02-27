const bus = require('@gotoeasy/bus');

// 按需引用样式
module.exports = bus.on('get-relative-css', function(){

    return function (...args) {
        let requireClasses = [];
        let tags = [];
        let pkg = this.pkg;
        let rename = this.rename;
        let atpage = false;

        // --------------------------------------------------
        // 按动画名取@keyframes样式
        let getKeyframes = animationName => {
            let keyframes = this.keyframes || [];
            for ( let i=0,node; node=keyframes[i++]; ) {
                if ( node.animation == animationName ) {
                    return node.toString(pkg, rename);
                }
            }
            return '';
        }
        // --------------------------------------------------

        // --------------------------------------------------
        // 按字体名取@font-face样式
        let getFontface = fontFamily => {
            let fonts = this.fonts || [];
            let ary = []; // 同名字体可以有多个@font-face
            for ( let i=0,node; node=fonts[i++]; ) {
                if ( (node.fontFamily||'').toLowerCase() == fontFamily.toLowerCase() ) {
                    ary.push( node.toString(pkg, rename) );
                }
            }
            return ary.join('\n');
        }
        // --------------------------------------------------

        // --------------------------------------------------
        // 按字体名取@font-face样式
        let getAtpage = () => {
            let atpages = this.atpages || [];
            let ary = [];
            for ( let i=0,node; node=atpages[i++]; ) {
                ary.push( node.toString(pkg, rename) );
            }
            return ary.join('\n');
        }
        // --------------------------------------------------

        // 整理输入
        args.forEach(arg => {
            if ( typeof arg === 'string' ) {
                arg.startsWith('.') ? requireClasses.push(arg.trim().toLowerCase().substring(1)) : tags.push(arg.trim().toLowerCase());
            }else if ( Object.prototype.toString.call(arg) === '[object Object]' ){
                arg.pkg && (pkg = arg.pkg);
                arg.rename && (rename = arg.rename);
                atpage = !!arg.atpage;
            }
        });

        // 按需查找引用
        if ( !requireClasses.length && !tags.length && !atpage ) {
            return '';  // 暂时仅实现通过类名、标签名按需引用
        }

        let rs = [];
        let animationSet = new Set();
        let fontSet = new Set();
        for ( let i=0,node,match,classes,elements; node=this.nodes[i++]; ) {
            classes = node.classes;
            elements = node.elements;
            if ( classes ) {

                if ( requireClasses.length ) {
                    // 含not条件时，去除not中的类名后再比较
                    if ( node.notclasses ) {
                        let oSet = new Set(node.classes);
                        node.notclasses.forEach(cls => oSet.delete(cls));
                        classes = [...oSet];
                    }
                    
                    // 类名全在应用范围内才算
                    if ( classes.every(cls => requireClasses.includes(cls.toLowerCase())) ) {
                        rs.push(node.toString(pkg, rename));
                        node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                        node.fontFamily && fontSet.add(node.fontFamily);    // 添加使用到的字体名
                    }
                }

            }else if ( elements ) {

                // 单一标签样式，且无类名选择器，在查询范围内则取出
                if ( tags.length ) {
                    if ( elements.length === 1 && tags.includes(elements[0]) ) {
                        rs.push(node.toString(pkg, rename));
                    }
                }

            }else {

                // 通配符等不含标签名和类名选择器的样式，如果有指定标签名条件，自动全部取出
                if ( tags.length ) {
                    rs.push(node.toString(pkg, rename));
                }
            }

            
        }

        animationSet.forEach(animationName => rs.push(getKeyframes(animationName)) );
        fontSet.forEach(fontFamily => rs.push(getFontface(fontFamily)) );
        atpage && rs.push(getAtpage()); // 打印用的@page样式

        return rs.join('\n');
    }

}());


