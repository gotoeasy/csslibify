# csslibify
这是一个库化CSS样式的工具<br>
<br>
<br>

[![NPM version](https://img.shields.io/npm/v/csslibify.svg)](https://www.npmjs.com/package/csslibify)
[![License](https://img.shields.io/badge/License-Apache%202-brightgreen.svg)](http://www.apache.org/licenses/LICENSE-2.0)
<br>
<br>
### `目的`
- [x] 方便的建立样式库
- [x] 按需取得相关样式 （样式会被拆解，需另行用工具合并优化）
- [x] 避免样式类名冲突
<br>

### `功能`
- [x] 创建样式库，可指定包名（命名空间）<br>
- [x] 把CSS或CSS文件导入到样式库（样式将被拆解）<br>
- [x] 样式库可多次导入不同CSS（自动去除重复）<br>
- [x] 样式库导入时自动复制CSS中的url资源<br>
- [x] 按需取样式，支持类名条件<br>
- [x] 按需取样式，支持自定义类名和动画名的修改<br>
- [x] 按需取样式，支持标签名条件<br>
- [x] 按需取样式，支持选项条件atpage取打印样式<br>
- [x] 按需取样式，指定标签名条件时自动取得不含标签名和类名选择器的通配符样式<br>


## Install
```
npm i csslibify
```


## API
- [x] csslibify(pkgname) - 创建指定包名（命名空间）的样式库<br>
      pkgname - 包名 （默认用于类名前缀，指定时需自行注意正确性）<br>
- [x] csslib.imp(cssOrFile, opts) - 把CSS或CSS文件导入到样式库<br>
      cssOrFile - 样式文件或内容 （必须输入）<br>
      opts.basePath - 样式所在目录 （文件时默认为文件所在目录，内容时默认当前目录）<br>
      opts.assetsPath - 修改后的url资源目录 （默认复制资源后使用绝对路径）<br>
- [x] csslib.get(...args) - 按需取样式<br>
      args - 字符串或选项对象，参数顺序无关<br>
      字符串时，以`.`开头的视为类名条件，否则视为标签名条件<br>
      选项对象时，opts.rename - 类名修改函数（第一参数为包名，第二参数为不含`.`的类名，返回新类名），默认为${pkg}---{classname}<br>
      选项对象时，opts.atpage - 是否包含@page样式，默认false<br>


## Sample
```js
let csslibify = require('csslibify');
let csslib = csslibify('thepkg');
csslib.imp('.foo{size:11} .bar{size:12} .foo > .bar{color:red}');
csslib.imp('.baz{size:13}');
csslib.imp('div{color:red}');
let css = csslib.get('.bar', '.baz');
//=>  .thepkg---bar{size:12} .thepkg---baz{size:13}

css = csslib.get('.foo', '.bar');
//=>  .thepkg---foo{size:11} .thepkg---bar{size:12} .thepkg---foo > .thepkg---bar{color:red}

css = csslib.get( 'div', '.foo', '.bar');
//=>  .thepkg---foo{size:11} .thepkg---bar{size:12} .thepkg---foo > .thepkg---bar{color:red} div{color:red}
```

## 测试结果示例（输出结果忽略顺序）
<details>
<summary><strong>01 新建样式库并指定库名，可有效避免类名冲突，也便于复用</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo{size:1}');
csslib.imp('.bar{size:2}');

let result = csslib.get( '.foo', '.bar' );

/*
// result:

.pkg---bar{size:2}
.pkg---foo{size:1}
*/
```
</details>


<details>
<summary><strong>02 新建样式库不指定库名，便于直接使用样式</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify();
csslib.imp('.foo{size:1}');
csslib.imp('.bar{size:2}');

let result = csslib.get( '.foo', '.bar' );

/*
// result:

.bar{size:2}
.foo{size:1}
*/
```
</details>


<details>
<summary><strong>03 自动识别重复导入</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify();
csslib.imp('.foo{size:1}');
csslib.imp('.foo{size:1}');
csslib.imp('.foo{size:1}');

let result = csslib.get( '.foo' );

/*
// result:

.foo{size:1}
*/
```
</details>


<details>
<summary><strong>04 样式类按需引用-例子1</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify();
csslib.imp('.foo{size:1}');
csslib.imp('.bar{size:2}');
csslib.imp('.baz{size:3}');

let result = csslib.get( '.baz' );

/*
// result:

.baz{size:3}
*/
```
</details>


<details>
<summary><strong>05 样式类按需引用-例子2</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify();
csslib.imp('.foo{size:1}');
csslib.imp('.bar .baz{size:2}');
csslib.imp('.baz{size:3}');

let result = csslib.get( '.baz' );

/*
// result:

.baz{size:3}
*/
```
</details>


<details>
<summary><strong>06 样式类按需引用-例子3</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify();
csslib.imp('.foo{size:1}');
csslib.imp('.bar .baz{size:2}');
csslib.imp('.baz{size:3}');

let result = csslib.get( '.bar', '.baz' );

/*
// result:

.bar .baz{size:2}
.baz{size:3}
*/
```
</details>


<details>
<summary><strong>07 样式类按需引用(含not条件)-例子1</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');

let result = csslib.get( '.foo' );

/*
// result:

.pkg---foo{size:1}
.pkg---foo:not(.pkg---bar){size:3}
*/
```
</details>


<details>
<summary><strong>08 样式类按需引用(含not条件)-例子2</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');

let result = csslib.get( '.bar' );

/*
// result:

.pkg---bar{size:2}
*/
```
</details>


<details>
<summary><strong>09 样式类按需引用(含not条件)-例子3</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo{size:1} .bar{size:2} .foo:not(.bar){size:3}');

let result = csslib.get( '.foo', '.bar' );

/*
// result:

.pkg---foo{size:1}
.pkg---bar{size:2}
.pkg---foo:not(.pkg---bar){size:3}
*/
```
</details>


<details>
<summary><strong>10 多选择器自动拆分引用-例子1</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo,.bar{size:1} .bar,.baz{color:red}');

let result = csslib.get( '.foo' );

/*
// result:

.pkg---foo{size:1}
*/
```
</details>


<details>
<summary><strong>11 多选择器自动拆分引用-例子2</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo,.bar{size:1} .bar,.baz{color:red}');

let result = csslib.get( '.foo', '.bar' );

/*
// result:

.pkg---bar{size:1}
.pkg---foo{size:1}
.pkg---bar{color:red}
*/
```
</details>


<details>
<summary><strong>12 多选择器自动拆分引用（@media）-例子1</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');

let result = csslib.get( '.foo' );

/*
// result:

@media (min-width: 768px) { .pkg---foo{margin: 0} }
*/
```
</details>


<details>
<summary><strong>13 多选择器自动拆分引用（@media）-例子2</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('@media (min-width: 768px) { .foo,.bar{margin: 0} }');

let result = csslib.get( '.foo', '.bar' );

/*
// result:

@media (min-width: 768px) { .pkg---bar{margin: 0} }
@media (min-width: 768px) { .pkg---foo{margin: 0} }
*/
```
</details>


<details>
<summary><strong>14 含动画keyframes时动画名一起修改-例子1</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.bar' );

/*
// result:

.pkg---bar{animation:pkg---foo 5s}
@keyframes pkg---foo{
  0% {background:red}
  to {background:yellow}
}
*/
```
</details>


<details>
<summary><strong>15 含动画keyframes时动画名一起修改-例子2</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.bar', '.baz' );

/*
// result:

.pkg---bar{
  animation:pkg---foo;
  animation-duration: 5s
}
@keyframes pkg---foo{
  0% {background:red}
  to {background:yellow}
}
.baz{size:14}
*/
```
</details>


<details>
<summary><strong>16 含动画keyframes时动画名一起修改-例子3</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.bar' );

/*
// result:

@media (min-width: 768px) {
  .pkg---bar{animation:pkg---foo 5s}
}
@keyframes pkg---foo{
  0% {background:red}
  to {background:yellow}
}
*/
```
</details>


<details>
<summary><strong>17 含动画keyframes时动画名一起修改-例子4</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.bar', '.baz' );

/*
// result:

.baz{size:14}
@media (min-width: 768px) {
  .pkg---bar{
    animation:pkg---foo;
    animation-duration: 5s
  }
}
@keyframes pkg---foo{
  0% {background:red}
  to {background:yellow}
}
*/
```
</details>


<details>
<summary><strong>18 含动画keyframes，用不到则不会取动画样式</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.baz' );

/*
// result:

.baz{size:14}
*/
```
</details>


<details>
<summary><strong>19 含动画keyframes，@supports嵌套规则使用动画</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
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

let result = csslib.get( '.baz' );

/*
// result:

@supports (position: sticky) {
  .pkg---bar{animation:pkg---foo 5s}
}
@keyframes pkg---foo {
  0% {background: red}
  to {background: yellow}
}
*/
```
</details>


<details>
<summary><strong>20 自定义修改类名 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('.foo{size:1}');

let result = csslib.get( '.foo', {rename: (pkg,name) => name + '-----' + pkg} );

/*
// result:

.foo-----pkg{size:1}
*/
```
</details>


<details>
<summary><strong>21 指定标签名按需引用样式-例子1 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('a{size:1} .foo div{size:2}');

let result = csslib.get( 'a' );

/*
// result:

a{size:1}
*/
```
</details>


<details>
<summary><strong>22 指定标签名按需引用样式@media-例子2 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('@media (min-width: 768px) { a{size:1} .foo div{size:2} }');

let result = csslib.get( 'div' );

/*
// result:(blank)

*/
```
</details>


<details>
<summary><strong>23 指定标签名按需引用样式-例子3 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('a{size:1} .foo div{size:2}');

let result = csslib.get( 'div' );

/*
// result:(blank)

*/
```
</details>


<details>
<summary><strong>24 同时指定类名标签名按需引用样式-例子1 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('a{size:1} .foo div{size:2}');

let result = csslib.get( 'div', '.foo' );

/*
// result:

.pkg---foo div{size:2}
*/
```
</details>


<details>
<summary><strong>25 同时指定类名标签名按需引用样式-例子2 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('@media (min-width: 768px) { a{size:1} .foo div{size:2} }');

let result = csslib.get( 'div', '.foo' );

/*
// result:

@media (min-width: 768px) { .pkg---foo div{size:2} }
*/
```
</details>


<details>
<summary><strong>26 自动引用@font-face样式 </strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp(`
  @font-face {
    font-family: 'Font Awesome 5 Free';
    font-style: normal;
    font-weight: 900;
    font-display: auto;
    src: url("../webfonts/fa-solid-900.eot");
    src: url("../webfonts/fa-solid-900.eot?#iefix") format("embedded-opentype"),
         url("../webfonts/fa-solid-900.woff2") format("woff2"),
	 url("../webfonts/fa-solid-900.woff") format("woff"),
	 url("../webfonts/fa-solid-900.ttf") format("truetype"),
	 url("../webfonts/fa-solid-900.svg#fontawesome") format("svg");
  }

  .fa,
  .fas {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
  }
`);

let result = csslib.get( '.fa' );

/*
// result: (注：实际url资源会被复制并哈希化文件名，默认路径改为资源文件的绝对路径)

  .fa {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
  }

  @font-face {
    font-family: 'Font Awesome 5 Free';
    font-style: normal;
    font-weight: 900;
    font-display: auto;
    src: url("../webfonts/fa-solid-900.eot");
    src: url("../webfonts/fa-solid-900.eot?#iefix") format("embedded-opentype"),
         url("../webfonts/fa-solid-900.woff2") format("woff2"),
	 url("../webfonts/fa-solid-900.woff") format("woff"),
	 url("../webfonts/fa-solid-900.ttf") format("truetype"),
	 url("../webfonts/fa-solid-900.svg#fontawesome") format("svg");
  }

*/
```
</details>


<details>
<summary><strong>27 指定标签名条件时自动取得不含标签名和类名选择器的通配符样式</strong></summary>

```js
let csslibify = require('csslibify');
let csslib = csslibify('pkg');
csslib.imp('article,aside { display: block; }  [title]{color:red} * {box-sizing: border-box;}');

let result = csslib.get( 'article' );

/*
// result:

* {box-sizing: border-box;}
[title]{color:red}
article { display: block; }
*/
```
</details>






## `Links`
* `npm-packages` https://github.com/gotoeasy/npm-packages

