const bus = require('@gotoeasy/bus');

module.exports = bus.on('normalize-plugin-to-single-selector', function(){
    return () => fnPlugin;
}());


function fnPlugin(root, result) {

    // 拆分规则 .foo,.bar,.baz{} => .foo{} .bar{} .baz{}
    root.walkRules( rule => {
        if ( rule.selectors.length < 2 ) return;

        let selectors = [...rule.selectors];
        rule.selector = selectors.pop();

        for ( let i=0,selector,cloneRule; selector=selectors[i++]; ) {
            cloneRule = rule.cloneBefore();
            cloneRule.selector = selector;
        }
    });
}
