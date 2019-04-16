const bus = require('@gotoeasy/bus');

// @viewport
bus.on('split-plugins', function fnPlugin(root, result) {

    let rs = bus.at('process-result-of-split-postcss-plugins');
    let atviewports = (rs.atviewports = rs.atviewports || []); // 处理结果节点数组

    root.walkAtRules('viewport', rule => {

        if ( rule.parent.type !== 'root' ) return;

        let oNode = {};
        oNode.template = rule.toString();
        oNode.toString = () => oNode.template;

        atviewports.push(oNode);

        rule.remove();
    });

});
