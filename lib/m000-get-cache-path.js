const bus = require('@gotoeasy/bus');
const os = require('@gotoeasy/os');
const File = require('@gotoeasy/file');

// -------------------------------------------------------------
// 取缓存目录
// -------------------------------------------------------------
module.exports = bus.on('get-cache-path', function(cachepath){

	return function(){
        if ( !cachepath ) {
            let oVer = JSON.parse(File.read(File.resolve(__dirname, '../package.json')));
            cachepath = File.resolve(os.homedir(), `.cache/${oVer.name}/${oVer.version}`);
        }
        return cachepath;
    }

}());

