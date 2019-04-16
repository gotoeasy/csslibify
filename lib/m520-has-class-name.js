const bus = require('@gotoeasy/bus');

// 检查样式库中是否有指定样式类
module.exports = bus.on('has-class-name', function(){

    return function (classname) {
        
        classname.startsWith('.') && (classname = classname.substring(1));     // 去‘.’
        for ( let i=0,node,classes; node=this.nodes[i++]; ) {
            classes = node.classes || [];
            if ( classes.includes(classname) ) {
                return true;
            }
        }
        return false;
    }

}());


