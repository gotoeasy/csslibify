const bus = require('@gotoeasy/bus');

// @keyframes
bus.on('split-plugins', function fnPlugin(root, result) {

    let rs = bus.at('process-result-of-split-postcss-plugins');
    let keyframes = (rs.keyframes = rs.keyframes || []); // 处理结果节点数组

    root.walkAtRules('keyframes', rule => {

        if ( rule.parent.type !== 'root' ) return;

        let name = rule.params;                     // keyframes名
        rule.params = '<%' + name + '%>';
        
        let oNode = {};
        oNode.animation = name;                     // 动画名，也是要改名的
        oNode.template = rule.toString();
        oNode.toString = bus.at('template-to-tostring', oNode.template, oNode.animation);

        keyframes.push(oNode);

        rule.remove();
    });

});
