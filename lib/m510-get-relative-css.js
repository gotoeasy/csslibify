const bus = require('@gotoeasy/bus');

// 按需引用样式
module.exports = bus.on('get-relative-css', function(){

    return function (...args) {
        let requireClasses = [];
        let requireTags = [];
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
        let getFontface = fontName => {
            let fontfaces = this.fontfaces || [];
            let ary = []; // 同名字体可以有多个@font-face
            for ( let i=0,node; node=fontfaces[i++]; ) {
                if ( node.fontName.toLowerCase() == fontName.toLowerCase() ) {
                    ary.push( node.toString(pkg, rename) );
                }
            }
            return ary.join('\n');
        }
        // --------------------------------------------------

        // --------------------------------------------------
        // 按字体名取@page样式
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
                arg.startsWith('.') ? requireClasses.push(arg.trim().toLowerCase().substring(1)) : requireTags.push(arg.trim().toLowerCase());
            }else if ( Object.prototype.toString.call(arg) === '[object Object]' ){
                arg.pkg && (pkg = arg.pkg);
                arg.rename && (rename = arg.rename);
                atpage = !!arg.atpage;
            }
        });

        // 按需查找引用
        if ( !requireClasses.length && !requireTags.length && !atpage ) {
            return '';  // 暂时仅实现通过类名、标签名按需引用
        }

        let rs = [];
        let animationSet = new Set();
        let fontNames = [];
        for ( let i=0,node,match,classes,elements; node=this.nodes[i++]; ) {
            classes = node.classes;
            elements = node.elements;
            if ( classes && elements ) {

                // ---------------------------------------------
                // 案1，标签名样式类名任一个在查询范围内就抽取使用
                // ---------------------------------------------
                let inc;
                requireClasses.forEach(cls => {
                    classes.includes(cls) && (inc = true);
                });
                requireTags.forEach(tag => {
                    elements.includes(tag) && (inc = true);
                });
                if ( inc ) {
                    rs.push(node.toString(pkg, rename));
                    node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                    node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                }

            }else if (classes){
                if ( requireClasses.length ) {

                    // ---------------------------------------------
                    // 案1，样式类名任一个在查询范围内就抽取使用
                    // ---------------------------------------------
                    requireClasses.forEach(cls => {
                        if ( classes.includes(cls) ) {
                            rs.push(node.toString(pkg, rename));
                            node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                            node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                        }
                    });

/*
                    // ---------------------------------------------
                    // 案2，样式类名全在查询范围内时才抽取使用
                    // ---------------------------------------------
                    // 含not条件时，去除not中的类名后再比较
                    if ( node.notclasses ) {
                        let oSet = new Set(node.classes);
                        node.notclasses.forEach(cls => oSet.delete(cls));
                        classes = [...oSet];
                    }
                    
                    // 类名全在应用范围内才算
                    if ( classes.length && classes.every(cls => requireClasses.includes(cls)) ) {
                        rs.push(node.toString(pkg, rename));
                        node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                        node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                    }
*/
                }

            }else if ( elements ) {

                // 标签样式，且无类名选择器，在查询范围内则取出
                if ( requireTags.length ) {
                    // ---------------------------------------------
                    // 案1，标签名任一个在查询范围内就抽取使用
                    // ---------------------------------------------
                    requireTags.forEach(tag => {
                        if ( elements.includes(tag) ) {
                            rs.push(node.toString(pkg, rename));
                            node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                            node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                        }
                    });

/*
                    // ---------------------------------------------
                    // 案2，标签名全在查询范围内时才抽取使用
                    // ---------------------------------------------
                    // 标签名全在应用范围内才算
                    if ( elements.length && elements.every(tag => requireTags.includes(tag)) ) {
                        rs.push(node.toString(pkg, rename));
                        node.animation && animationSet.add(node.animation);    // 添加使用到的动画名
                        node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                    }
*/
                }

            }else {

                // 通配符等不含标签名和类名选择器的样式，如果有指定标签名条件，自动全部取出
                if ( requireTags.length ) {
                    rs.push(node.toString(pkg, rename));
                }
            }

            
        }

        animationSet.forEach(animationName => rs.push(getKeyframes(animationName)) );
        let fontSet = new Set(fontNames);

        fontSet.forEach(fontName => rs.push(getFontface(fontName)) );
        atpage && rs.push(getAtpage()); // 打印用的@page样式

        return [...new Set(rs)].join('\n');
    }

}());


