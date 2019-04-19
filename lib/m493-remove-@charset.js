const bus = require('@gotoeasy/bus');

// 删除@charset
bus.on('split-plugins', function fnPlugin(root, result) {

    root.walkAtRules('charset', rule => {

        rule.remove();
    });

});
