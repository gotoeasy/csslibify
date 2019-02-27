const bus = require('@gotoeasy/bus');

module.exports = bus.on('get-split-postcss-plugins', function(){

    return () => bus.on('split-plugins');

}());

