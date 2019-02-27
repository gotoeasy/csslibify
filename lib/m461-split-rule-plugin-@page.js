const bus = require('@gotoeasy/bus');

// 拆解含类选择器的普通标签样式，非嵌套样式
bus.on('split-plugins', function fnPlugin(root, result) {

    let rs = bus.at('process-result-of-split-postcss-plugins');
    let atpages = (rs.atpages = rs.atpages || []); // 处理结果节点数组

    root.walkAtRules('page', rule => {

        if ( !(rule.parent.type === 'atrule' || rule.parent.name === 'media' || rule.parent.parent.type === 'root') ) return;

        let mediaRule = rule.parent.clone();
        let pageRule = rule.clone();
        mediaRule.removeAll();
        mediaRule.append(pageRule)

        let oNode = {};
        oNode.template = mediaRule.toString();
        oNode.toString = () => oNode.template;

        atpages.push(oNode)

        rule.remove();
    });

});
