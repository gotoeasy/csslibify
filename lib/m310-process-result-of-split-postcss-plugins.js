const bus = require('@gotoeasy/bus');

// 存取插件处理结果
module.exports = bus.on('process-result-of-split-postcss-plugins', function(result={}){

	return (rs) => {
        rs && (result = rs);    // 有参数时按参数重置
        return result;
    };

}());
