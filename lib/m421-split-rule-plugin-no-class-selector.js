const bus = require('@gotoeasy/bus');

// 拆解普通的标签样式，不包含类选择器，非嵌套样式
bus.on('split-plugins', function fnPlugin(root, result) {

    let nodes = bus.at('process-result-of-split-postcss-plugins').nodes; // 处理结果节点数组

    root.walkRules( rule => {

        if ( rule.parent.type !== 'root' ) return;

        let oSelector = bus.at('parseSingleSelector', rule.selector);
        if ( oSelector.classes ) return;

        let oNode = Object.assign({}, oSelector);

//        rule.animation && (oNode.template = rule.animation);
        oNode.template = rule.toString();
        oNode.toString = () => oNode.template;

        nodes.push(oNode)

        rule.remove();
    });

});
