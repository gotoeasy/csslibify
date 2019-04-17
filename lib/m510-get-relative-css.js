const bus = require('@gotoeasy/bus');

// 按需引用样式
module.exports = bus.on('get-relative-css', function(){

    return function (...args) {
        let requireClasses = [];
        let requireTags = [];
        let pkg = this.pkg;
        let rename = this.rename;

        let strict = true;          // 是否按严格模式匹配查询
        let atpage = false;         // 是否查询 @page
        let atviewport = false;     // 是否查询 @viewport
        let universal = false;      // 是否查询通用样式（不含类名和标签名的通用样式，如通配符选择器属性选择器等）

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

        // --------------------------------------------------
        // 取@viewport样式
        let getAtviewport = () => {
            let atviewports = this.atviewports || [];
            let ary = [];
            for ( let i=0,node; node=atviewports[i++]; ) {
                ary.push( node.toString(pkg, rename) );
            }
            return ary.join('\n');
        }
        // --------------------------------------------------

        // 整理输入
        args.forEach(arg => {
            if ( typeof arg === 'string' ) {
                arg.startsWith('.') ? requireClasses.push(arg.trim().substring(1)) : requireTags.push(arg.trim().toLowerCase());
            }else if ( Object.prototype.toString.call(arg) === '[object Object]' ){
                // 指定选项设定时读取使用
                arg.pkg && (pkg = arg.pkg);
                arg.rename && (rename = arg.rename);
                arg.atpage !== undefined && (atpage = !!arg.atpage);
                arg.atviewport !== undefined && (atviewport = !!arg.atviewport);
                arg.strict !== undefined && (strict = !!arg.strict);
                arg.universal !== undefined && (universal = !!arg.universal);
            }else{
                // 忽略无效参数
            }
        });

        // 按需查找引用
        if ( !requireClasses.length && !requireTags.length && !atpage && !atviewport && !universal ) {
            return '';  // 暂时仅实现通过类名、标签名按需引用
        }

        let rs = [];
        let animationSet = new Set();
        let fontNames = [];
        for ( let i=0,node,match,classes,elements,matchCls,matchTag; node=this.nodes[i++]; ) {
            classes = (node.classes && node.classes.length) ? node.classes : null;
            elements = (node.elements && node.elements.length) ? node.elements : null;
            match = false;
            matchCls = false;
            matchTag = false;

            if ( classes && elements ) {

                if ( strict ) {
                    // -----------------------------------------------------------
                    // 【严格引用模式】 标签名和样式类名全在查询范围内时才抽取使用
                    // -----------------------------------------------------------
                    if ( requireClasses.length && requireTags.length ) {
                        if ( node.notclasses ) {
                            // 含not条件时，去除not中的类名后再比较
                            let oSet = new Set(node.classes);
                            node.notclasses.forEach(cls => oSet.delete(cls));
                            classes = [...oSet];
                        }
                        if ( classes.length ) {
                            if ( classes.every(cls => requireClasses.includes(cls)) ) {
                                // 类名全在查询范围内才算匹配成功
                                matchCls = true;
                            }
                        }else{
                            // 类名全在not条件中，类名匹配算成功，具体由标签名匹配决定
                            matchCls = true;
                        }

                        if ( elements.every(tag => requireTags.includes(tag)) ) {
                            // 标签名全在应用范围内才算
                            matchTag = true;
                        }

                        if ( matchCls && matchTag ) {
                            // 标签名和样式类名全在查询范围内时才抽取使用
                            rs.push(node.toString(pkg, rename));
                            node.animation && animationSet.add(node.animation);         // 添加使用到的动画名
                            node.fontNames && fontNames.push(...node.fontNames);        // 添加使用到的字体名
                        }
                    }

                }else{
                    // -----------------------------------------------------------
                    // 【宽松引用模式】 标签名样式类名任一个在查询范围内就抽取使用
                    // -----------------------------------------------------------
                    requireClasses.forEach(cls => {
                        classes.includes(cls) && (match = true);
                    });
                    requireTags.forEach(tag => {
                        elements.includes(tag) && (match = true);
                    });
                    if ( match ) {
                        rs.push(node.toString(pkg, rename));
                        node.animation && animationSet.add(node.animation);         // 添加使用到的动画名
                        node.fontNames && fontNames.push(...node.fontNames);        // 添加使用到的字体名
                    }
                }

            }else if (classes){

                // 只有类名选择器样式，且无标签名选择器样式
                if ( requireClasses.length ) {

                    if ( strict ) {
                        // -----------------------------------------------------------
                        // 【严格引用模式】 样式类名全在查询范围内时才抽取使用
                        // -----------------------------------------------------------
                        if ( node.notclasses ) {
                            // 含not条件时，去除not中的类名后再比较
                            let oSet = new Set(node.classes);
                            node.notclasses.forEach(cls => oSet.delete(cls));
                            classes = [...oSet];
                        }
                        if ( classes.length ) {
                            if ( classes.every(cls => requireClasses.includes(cls)) ) {
                                // 类名全在查询范围内才算匹配成功
                                matchCls = true;
                            }
                        }else{
                            // 类名全在not条件中，类名匹配算成功，具体由标签名匹配决定
                            matchCls = true;
                        }
                        if ( matchCls ) {
                            // 样式类名全在查询范围内时才抽取使用
                            rs.push(node.toString(pkg, rename));
                            node.animation && animationSet.add(node.animation);         // 添加使用到的动画名
                            node.fontNames && fontNames.push(...node.fontNames);        // 添加使用到的字体名
                        }
                    }else{
                        // -----------------------------------------------------------
                        // 【宽松引用模式】 样式类名任一个在查询范围内就抽取使用
                        // -----------------------------------------------------------
                        requireClasses.forEach(cls => {
                            if ( classes.includes(cls) ) {
                                rs.push(node.toString(pkg, rename));
                                node.animation && animationSet.add(node.animation);     // 添加使用到的动画名
                                node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                            }
                        });
                    }

                }
 
            }else if ( elements ) {

                // 只有标签名选择器样式，且无类名选择器样式
                if ( requireTags.length ) {

                    if ( strict ) {
                        // -----------------------------------------------------------
                        // 【严格引用模式】 标签名全在查询范围内时才抽取使用
                        // -----------------------------------------------------------
                        if ( elements.every(tag => requireTags.includes(tag)) ) {
                            rs.push(node.toString(pkg, rename));
                            node.animation && animationSet.add(node.animation);         // 添加使用到的动画名
                            node.fontNames && fontNames.push(...node.fontNames);        // 添加使用到的字体名
                        }
                    }else{
                        // -----------------------------------------------------------
                        // 【宽松引用模式】 样式类名任一个在查询范围内就抽取使用
                        // -----------------------------------------------------------
                        requireTags.forEach(tag => {
                            if ( elements.includes(tag) ) {
                                rs.push(node.toString(pkg, rename));
                                node.animation && animationSet.add(node.animation);     // 添加使用到的动画名
                                node.fontNames && fontNames.push(...node.fontNames);    // 添加使用到的字体名
                            }
                        });
                    }
                    
                }

            }else {

                // 通用样式
                if ( universal ) {
                    rs.push(node.toString(pkg, rename));
                }
            }

            
        }

        animationSet.forEach(animationName => rs.push(getKeyframes(animationName)) );   // 动画样式 @keyframes
        new Set(fontNames).forEach(fontName => rs.push(getFontface(fontName)) );        // 字体样式 @font-face
        atpage && rs.push(getAtpage());                                                 // 打印用样式 @page
        atviewport && rs.push(getAtviewport());                                         // 设定文档大小用样式 @viewport

        return [...new Set(rs)].join('\n');
    }

}());


