const bus = require('@gotoeasy/bus');

// 删除无内容的@supports样式
bus.on('split-plugins', function fnPlugin(root, result) {

    root.walkAtRules('supports', rule => {

        if ( !rule.nodes.length ) {
            rule.remove();
        }
    });

});
