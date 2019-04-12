const bus = require('@gotoeasy/bus');

// 拆解含类选择器的普通标签样式，非嵌套样式
bus.on('split-plugins', function fnPlugin(root, result) {

    let nodes = bus.at('process-result-of-split-postcss-plugins').nodes; // 处理结果节点数组

    root.walkRules( rule => {

        if ( rule.parent.type !== 'root' ) return;

        let oSelector = bus.at('parseSingleSelector', rule.selector);
        if ( !oSelector.classes ) return;

        let oNode = Object.assign({}, oSelector);

        rule.selector = oSelector.selectorTemplate;                 // .foo > .bar => .<%foo%> > .<%bar%>

        rule.animation && (oNode.animation = rule.animation);       // foo ------ animation: foo 5s; 或 animation-name: foo;
        if ( rule.animation ) {
            rule.nodes.forEach(node => {
                if ( /^animation$/i.test(node.prop) ) {
                    let ary = node.value.split(' ');
                    ary[0] = '<%' + ary[0] + '%>'                   // animation: foo 5s; => animation: <%foo%> 5s;
                    node.value = ary.join(' ');
                }else if ( /^animation-name$/i.test(node.prop) ) {
                    node.value = '<%' + node.value + '%>';          // animation-name: foo; => animation: <%foo%>;
//                }else if ( /^font-family$/i.test(node.prop) ) {
//                    node.value = '<%' + node.value + '%>';          // font-family: foo; => font-family: <%foo%>;
                }
            })
        }
        rule.fontNames && (oNode.fontNames = [...rule.fontNames]);
        oNode.template = rule.toString();
        oNode.toString = bus.at('template-to-tostring', oNode.template, ...oNode.classes, oNode.animation);

        nodes.push(oNode)

        rule.remove();
    });

});
