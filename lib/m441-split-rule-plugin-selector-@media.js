const bus = require('@gotoeasy/bus');

// 拆解普通的标签样式，不包含类选择器，非嵌套样式
bus.on('split-plugins', function fnPlugin(root, result) {

    let nodes = bus.at('process-result-of-split-postcss-plugins').nodes; // 处理结果节点数组

    root.walkRules( rule => {

        if ( !(rule.parent.type === 'atrule' && rule.parent.name === 'media' && rule.parent.parent.type === 'root') ) {
            return;
        }

        let oSelector = bus.at('parseSingleSelector', rule.selector);
        let oNode = Object.assign({}, oSelector);

        if ( oSelector.classes ) {
            // 含类选择器时，如果有动画名，也要按类名一样处理避免动画名冲突
            let curRule = rule.clone();
            curRule.selector = oSelector.selectorTemplate; // .foo > .bar => .<%foo%> > .<%bar%>
            let mediaRule = rule.parent.clone();
            mediaRule.removeAll();
            mediaRule.append(curRule);

            if ( curRule.animation ) {
                oNode.animation = curRule.animation;                    // foo ------ animation: foo 5s; 或 animation-name: foo;

                curRule.nodes.forEach(node => {
                    if ( /^animation$/i.test(node.prop) ) {
                        let ary = node.value.split(' ');
                        ary[0] = '<%' + ary[0] + '%>'                   // animation: foo 5s; => animation: <%foo%> 5s;
                        node.value = ary.join(' ');
                    }else if ( /^animation-name$/i.test(node.prop) ) {
                        node.value = '<%' + node.value + '%>';          // animation-name: foo; => animation: <%foo%>;
                    }
                })
            }

            rule.fontNames && (oNode.fontNames = rule.fontNames);
            oNode.template = mediaRule.toString();
            oNode.toString = bus.at('template-to-tostring', oNode.template, ...oNode.classes, oNode.animation);
        }else{
            // 不含类选择器时，忽略动画名
            let curRule = rule.clone();
            let mediaRule = rule.parent.clone();
            mediaRule.removeAll();
            mediaRule.append(curRule);

            oNode.template = mediaRule.toString();
            oNode.toString = () => oNode.template;
        }



        nodes.push(oNode)

        rule.remove();
    });

});
