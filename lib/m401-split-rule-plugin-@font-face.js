const bus = require('@gotoeasy/bus');

// @font-face
bus.on('split-plugins', function fnPlugin(root, result) {

    let rs = bus.at('process-result-of-split-postcss-plugins');
    let fontfaces = (rs.fontfaces = rs.fontfaces || []); // 处理结果节点数组

    root.walkAtRules('font-face', rule => {

        if ( rule.parent.type !== 'root' ) return;


        let oNode = {};
        oNode.fontName = getFontName(rule);
        oNode.template = rule.toString();
        oNode.toString = () => oNode.template;

        fontfaces.push(oNode);

        rule.remove();
    });

});

function getFontName(rule){
    let nodes = rule.nodes || [];
    for ( let i=0,node; node=nodes[i++]; ) {
        if ( /^font-family$/i.test(node.prop) ) {
            return node.value.replace(/['"]+/g, '');
        }
    }

    return '';
}