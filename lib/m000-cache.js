const bus = require('@gotoeasy/bus');
const File = require('@gotoeasy/file');
const cache = require('@gotoeasy/cache');

// --------------------------------------
// 缓存
// --------------------------------------
module.exports = bus.on('cache', function(oCache){

	return function(){
        if ( !oCache ) {
            let oVer = JSON.parse(File.read(File.resolve(__dirname, '../package.json')));
            oCache = cache({name: 'csslibify@' + oVer.version});
        }
        return oCache;
    }

}());

