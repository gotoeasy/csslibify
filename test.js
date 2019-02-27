const test = require('ava');
const csslibify = require('.');


test('35 有标签名条件时，自动取出通配符等不含标签及类名选择器的样式', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = 'article,aside { display: block; }  [title]{color:red} * {box-sizing: border-box;}';
    csslib.imp(css);

    rs = csslib.get( 'article' );
    isSameCss(t, rs, '* {box-sizing: border-box;} [title]{color:red} article { display: block; }');
});

test('34 打印用样式@media中的@page-例子3', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media print { h2 { page-break-after: avoid }  @page { size: a3 } }';
    csslib.imp(css);

    rs = csslib.get( 'h2', {atpage:true} );
    isSameCss(t, rs, '@media print { h2 { page-break-after: avoid } } @media print { @page { size: a3 } }');
});

test('33 打印用样式@media中的@page-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media print { h2 { page-break-after: avoid }  @page { size: a3 } }';
    csslib.imp(css);

    rs = csslib.get( {atpage:true} );
    isSameCss(t, rs, '@media print { @page { size: a3 } }');
});

test('32 打印用样式@media中的@page-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media print { h2 { page-break-after: avoid }  @page { size: a3 } }';
    csslib.imp(css);

    rs = csslib.get( 'h2' );
    isSameCss(t, rs, '@media print { h2 { page-break-after: avoid } }');
});

test('31 类名标签名条件按需引用@media', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media (min-width: 768px) {a{size:1} div .foo{size:2}}';
    csslib.imp(css);

    rs = csslib.get( '.foo' );
    isSameCss(t, rs, '@media (min-width: 768px) {div .pkg---foo{size:2}}');
    rs = csslib.get( 'a' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1}}');
    rs = csslib.get( 'a', '.foo' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1} } @media (min-width: 768px) {div .pkg---foo{size:2}}');
    rs = csslib.get( 'a', '.foo', 'div' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1}} @media (min-width: 768px) { div .pkg---foo{size:2} }'); 
});

test('30 标签名条件按需引用@media-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media (min-width: 768px) {a{size:1} .foo div{size:2}}';
    csslib.imp(css);

    rs = csslib.get( 'a' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1}}');
    rs = csslib.get( 'div' );
    isSameCss(t, rs, '');
    rs = csslib.get( 'a', 'div' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1}}');
});


test('29 标签名条件按需引用@media-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '@media (min-width: 768px) { a{size:1} div{size:2} }';
    csslib.imp(css);

    rs = csslib.get( 'a' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1}}');
    rs = csslib.get( 'div' );
    isSameCss(t, rs, '@media (min-width: 768px) {div{size:2}}');
    rs = csslib.get( 'a', 'div' );
    isSameCss(t, rs, '@media (min-width: 768px) {a{size:1} } @media (min-width: 768px) {div{size:2}}');
});


test('28 类名标签名条件按需引用', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = 'a{size:1} div .foo{size:2}';
    csslib.imp(css);

    rs = csslib.get( '.foo' );
    isSameCss(t, rs, 'div .pkg---foo{size:2}');
    rs = csslib.get( 'a' );
    isSameCss(t, rs, 'a{size:1}');
    rs = csslib.get( 'a', '.foo' );
    isSameCss(t, rs, 'a{size:1} div .pkg---foo{size:2}');
    rs = csslib.get( 'a', '.foo', 'div' );
    isSameCss(t, rs, 'a{size:1} div .pkg---foo{size:2}');
});

test('27 标签名条件按需引用-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = 'a{size:1} .foo div{size:2}';
    csslib.imp(css);

    rs = csslib.get( 'a' );
    isSameCss(t, rs, 'a{size:1}');
    rs = csslib.get( 'div' );
    isSameCss(t, rs, '');
    rs = csslib.get( 'a', 'div' );
    isSameCss(t, rs, 'a{size:1}');
});


test('26 标签名条件按需引用-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = 'a{size:1} div{size:2}';
    csslib.imp(css);

    rs = csslib.get( 'a' );
    isSameCss(t, rs, 'a{size:1}');
    rs = csslib.get( 'div' );
    isSameCss(t, rs, 'div{size:2}');
    rs = csslib.get( 'a', 'div' );
    isSameCss(t, rs, 'a{size:1} div{size:2}');
});


test('25 没有查询条件及忽略无效条件', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '.foo{size:1}';
    csslib.imp(css);

    rs = csslib.get( {rename: (pkg,name) => name + '-----' + pkg} );
    isSameCss(t, rs, '');
    rs = csslib.get(1,2,3);
    isSameCss(t, rs, '');
    rs = csslib.get();
    isSameCss(t, rs, '');
});

test('24 自定义改名', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '.foo{size:1}';
    csslib.imp(css);

    rs = csslib.get( '.foo', {rename: (pkg,name) => name + '-----' + pkg} );
    isSameCss(t, rs, '.foo-----pkg{size:1}');
});


test('23 按需引用字体', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp('node_modules/@fortawesome/fontawesome-free/css/all.css');

    rs = csslib.get( '.fa' );
    t.is(true, rs.indexOf('@font-face') > 0)
    t.is(true, rs.indexOf('Font Awesome\\ 5 Free') > 0)
});



test('22 含动画keyframes，@supports中使用动画-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      @supports (position: sticky) {
        .bar {
            animation-name:foo;
            animation-duration: 5s;
        }
     }
     .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar' );
    isSameCss(t, rs, '@supports (position: sticky) { .pkg---bar{animation-name:pkg---foo;animation-duration:5s} } @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});


test('21 含动画keyframes，@supports中使用动画-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      @supports (position: sticky) {
        .bar {
          animation:foo 5s;
        }
     }
     .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar' );
    isSameCss(t, rs, '@supports (position: sticky) { .pkg---bar{animation:pkg---foo 5s} } @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});



test('20 含动画keyframes，用不到则不会取动画样式', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      .bar {
        animation:foo 5s;
      }
      @media (min-width: 768px) {
          .bar-baz {
            animation-name:foo;
            animation-duration: 5s;
          }
      }
     .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.baz' );
    isSameCss(t, rs, '.pkg---baz{size:14}');

});


test('19 动画@keyframes，动画名一起修改-例子4', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      @media (min-width: 768px) {
          .bar {
            animation-name:foo;
            animation-duration: 5s;
          }
      }
      .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar', '.baz' );
    isSameCss(t, rs, ' .pkg---baz{size:14} @media (min-width: 768px) {.pkg---bar { animation-name: pkg---foo;animation-duration: 5s}} @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});

test('18 动画@keyframes，动画名一起修改-例子3', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      @media (min-width: 768px) {
          .bar {
            animation:foo 5s;
          }
      }
      .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar' );
    isSameCss(t, rs, '@media (min-width: 768px) {.pkg---bar { animation: pkg---foo 5s;}} @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});


test('17 动画@keyframes，动画名一起修改-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      .bar {
        animation-name:foo;
        animation-duration: 5s;
      }
      .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar', '.baz' );
    isSameCss(t, rs, '.pkg---bar { animation-name: pkg---foo;animation-duration: 5s} .pkg---baz{size:14} @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});


test('16 动画@keyframes，动画名一起修改-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);
    csslib.imp(`
      @keyframes foo{
        0% {background:red}
        to {background:yellow}
      }
      .bar {
        animation:foo 5s;
      }
      .baz {
        size:14;
      }
    `);

    rs = csslib.get( '.bar' );
    isSameCss(t, rs, '.pkg---bar { animation: pkg---foo 5s;} @keyframes pkg---foo { 0% {background: red;} to {background: yellow;} }');

});

test('15 多选择器自动拆分引用（@media），重复，使用缓存，增加覆盖率', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '@media (min-width: 768px) { .pkg---bar{margin: 0} } @media (min-width: 768px) { .pkg---foo{margin: 0} }');

	csslib = csslibify(pkg);

    csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '@media (min-width: 768px) { .pkg---bar{margin: 0} } @media (min-width: 768px) { .pkg---foo{margin: 0} }');
});

test('14 多选择器自动拆分引用（@media）-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '@media (min-width: 768px) { .pkg---bar{margin: 0} } @media (min-width: 768px) { .pkg---foo{margin: 0} }');
});

test('13 多选择器自动拆分引用（@media）-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');
    rs = csslib.get( '.foo' );
    isSameCss(t, rs, '@media (min-width: 768px) { .pkg---foo{margin: 0} }');
});


test('12 多选择器自动拆分引用-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('.foo,.bar{size:1} .bar,.baz{color:red}');
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.pkg---bar{color:red} .pkg---bar{size:1} .pkg---foo{size:1}');
});


test('11 多选择器自动拆分引用-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('.foo,.bar{size:1} .bar,.baz{color:red}');
    rs = csslib.get( '.foo' );
    isSameCss(t, rs, '.pkg---foo{size:1}');
});


test('10 样式类按需引用，含not条件-例子3', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.pkg---bar{size:2} .pkg---foo:not(.pkg---bar){size:3} .pkg---foo{size:1}');
});


test('09 样式类按需引用，含not条件-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');
    rs = csslib.get( '.bar' );
    isSameCss(t, rs, '.pkg---bar{size:2}');
});


test('08 样式类按需引用，含not条件-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

    csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');
    rs = csslib.get( '.foo' );
    isSameCss(t, rs, '.pkg---foo:not(.pkg---bar){size:3} .pkg---foo{size:1}');
});



test('07 样式类按需引用-例子3', t => {
	let css, pkg, csslib, rs;

    pkg = '';
	csslib = csslibify();

    csslib.imp('.foo{size:1}');
    csslib.imp('.bar .baz{size:2}');
    csslib.imp('.baz{size:3}');

    rs = csslib.get( '.bar', '.baz' );
    isSameCss(t, rs, '.bar .baz{size:2} .baz{size:3}');
});

test('06 样式类按需引用-例子2', t => {
	let css, pkg, csslib, rs;

    pkg = '';
	csslib = csslibify();

    csslib.imp('.foo{size:1}');
    csslib.imp('.bar .baz{size:2}');
    csslib.imp('.baz{size:3}');

    rs = csslib.get( '.baz' );
    isSameCss(t, rs, '.baz{size:3}');
});

test('05 样式类按需引用-例子1', t => {
	let css, pkg, csslib, rs;

    pkg = '';
	csslib = csslibify();

    csslib.imp('.foo{size:1}');
    csslib.imp('.bar{size:2}');
    csslib.imp('.baz{size:3}');

    rs = csslib.get( '.baz' );
    isSameCss(t, rs, '.baz{size:3}');
});


test('04 readme中的简易例子', t => {
	let css, pkg, csslib, rs;

    pkg = 'thepkg';
	csslib = csslibify(pkg);

	css = '.foo{size:11} .bar{size:12} .foo > .bar{color:red}';
    csslib.imp(css);
	css = '.baz{size:13}';
    csslib.imp(css);

    rs = csslib.get( '.bar', '.baz' );
    isSameCss(t, rs, '.thepkg---bar{size:12} .thepkg---baz{size:13}');

    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.thepkg---bar{size:12} .thepkg---foo > .thepkg---bar{color:red} .thepkg---foo{size:11}');
});


test('03 导入样式库，无库名，多次导入自动合并，无重复', t => {
	let css, pkg, csslib, rs;
	csslib = csslibify();

	css = '.foo{size:1}';
    csslib.imp(css);
	css = '.foo{size:1}';
    csslib.imp(css);
	css = '.foo{size:1}';
    csslib.imp(css);

    rs = csslib.nodes.length;
    t.is(rs, 1);
    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.foo{size:1}');
});

test('02 导入样式库，无库名，多次导入自动合并', t => {
	let css, pkg, csslib, rs;
	csslib = csslibify();

	css = '.foo{size:1}';
    csslib.imp(css);
	css = '.bar{size:2}';
    csslib.imp(css);

    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.bar{size:2} .foo{size:1}');
});


test('01 导入样式库，指定库名，多次导入自动合并', t => {
	let css, pkg, csslib, rs;

    pkg = 'pkg';
	csslib = csslibify(pkg);

	css = '.foo{size:1}';
    csslib.imp(css);
	css = '.bar{size:2}';
    csslib.imp(css);

    rs = csslib.get( '.foo', '.bar' );
    isSameCss(t, rs, '.pkg---bar{size:2} .pkg---foo{size:1}');
});


















function isSameCss(t, css1, css2){
    let rs = hashCss(css1.toLowerCase()) === hashCss(css2.toLowerCase());
    if ( rs ) return t.is(true, true);

    t.is(css1, css2);
}

function hashCss(str){
	let rs = 0, i = (str == null ? 0 : str.length), ch;
	while ( i ) {
        ch = str.charCodeAt(--i);
        if (  (ch > 59) || (ch !== 59 && ch !== 32 && ch && 9 && ch !== 10 && ch !== 13)  ) {    // 忽略回车换行tab空格分号(9/10/13/32/59)
            rs = (rs * 33) ^ ch;
        }
	}
	return rs >>> 0;
}
