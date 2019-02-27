const bus = require('@gotoeasy/bus');
const tokenizer = require('css-selector-tokenizer');


bus.on('parseSingleSelector', function(){

    return function(selector){
        let nodes, rs = {};
        let ast = tokenizer.parse(selector);

        if ( !ast.nodes || !ast.nodes.length ) return rs;
        nodes = ast.nodes[0].nodes;
        if ( !nodes || !nodes.length ) return rs;

        parseNodes(ast, nodes, rs);
// console.info('-----rs-----',  rs)
        return rs;
    };

}());

function parseNodes(ast, nodes, rs){
    nodes.forEach(node => {
        if ( node.type === 'class' ) {
            (rs.classes=rs.classes||[]).push(node.name);
            node.name = '<%' + node.name + '%>';
            rs.selectorTemplate = tokenizer.stringify(ast).replace(/\\<\\%/g, '<%').replace(/\\%\\>/g, '%>');
        }else if ( node.type === 'element' ) {
            (rs.elements=rs.elements||[]).push(node.name);
        }else if ( node.type === 'attribute' ) {
            (rs.attributes=rs.attributes||[]).push( node.content.split(/[~\|\^\$\*]?=/)[0] );    // 取出属性名
        }else if ( node.type === 'universal' ) {
            rs.universal = true;                // 星号*通配符选择器，仅做个标记
        }else if ( node.type === 'spacing' || node.type === 'spacing' ) {
            // 嵌套空白符，忽略
        }else if ( node.type === 'pseudo-class' || node.type === 'pseudo-element'  ) {
            rs.pseudo = true;                   // 冒号和双冒号的伪类伪元素，仅做个标记
        }else if ( node.type === 'nested-pseudo-class'  ) {
            // .foo:not(.bar){}  =>  把not中的bar找出来，放到notclasses中
            rs.pseudo = true;
            if ( node.name === 'not' && node.nodes ) {
                node.nodes.forEach(nd => {
                    nd.nodes && nd.nodes.forEach(n => {
                        n.type === 'class' && (rs.notclasses = rs.notclasses || []).push(n.name);
                    });
                });
            }
        }else if ( node.type === 'selector' ) {
            // 嵌套选择器，忽略
        }else{
            // 貌似无关了，暂且忽略
 //console.info('-----todo------type/name---',  node.type, node.name)
        }

        node.nodes && parseNodes(ast, node.nodes, rs);
    })
}

/*
[attribute]	用于选取带有指定属性的元素。
[attribute=value]	用于选取带有指定属性和值的元素。
[attribute~=value]	用于选取属性值中包含指定词汇的元素。
[attribute|=value]	用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。
[attribute^=value]	匹配属性值以指定值开头的每个元素。
[attribute$=value]	匹配属性值以指定值结尾的每个元素。
[attribute*=value]	匹配属性值中包含指定值的每个元素。
*/



bus.on('template-to-tostring', function(){

    return function(template, ...names){
        template = lineString(template);
        for ( let i=0,name,reg; i<names.length; i++ ) {
            name = names[i];
            if ( name ) {
                reg = new RegExp('<%' + name + '%>', 'ig');                     // TODO 名称通常没有正则冲突，暂不考虑
                template = template.replace(reg, `'+rename(pkg,'${name}')+'`);
            }
        }
        template = `return '${template}'`;
        return new Function('pkg=""', 'rename=(p,n)=>`${p?(p+"---"):""}${n}`', template);
    };

}());


function lineString(str, quote = "'") {
	if ( str == null ) return str;

	let rs = str.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n')
	if ( quote == '"' ) {
		rs = rs.replace(/"/g, '\\"');
	}else if ( quote == "'" ) {
		rs = rs.replace(/'/g, "\\'");
	}
	return rs;
}


