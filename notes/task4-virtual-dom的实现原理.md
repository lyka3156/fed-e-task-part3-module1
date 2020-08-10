# 1. virtual-dom 的实现原理

## 1.1 什么是虚拟 DOM , 以及虚拟 DOM 的作用

### 1.1.1 什么是虚拟 DOM

- Virtual DOM(虚拟 DOM)，是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，所以叫 Virtual DOM
- 真实 DOM 成员

```js
// 真实 dom 的成员
let element = document.querySelector("#app");
let props = "";
for (var key in element) {
  props += key + ",";
}
console.log(props);
// 打印结果
// title,dir,hidden,translate,onmouseenter,onmouseleave,onmousemove,onmouseout...............
```

- 可以使用 Virtual DOM 来描述真实 DOM，示例

```js
// 虚拟 dom 的成员
let dom = {
  sel: "div",
  data: {},
  children: undefined,
  text: "Hello Virtual DOM",
  elm: undefined,
  key: undefined,
};
```

综上总结：

- 虚拟 dom 的成员没有真实 dom 的成员这么多
- 也就是创建虚拟 dom 的开销比创建真实 dom 的开销要少很多

### 1.1.2 为什么使用虚拟 DOM

- 手动操作 DOM 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 jQuery 等库简化 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题
- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是 Virtual DOM 出现了
  - 使用 jquery 在 table 中添加元素和排序会有闪烁的效果 (因为没有解决跟踪状态变化的问题)
- Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述 DOM， Virtual DOM 内部将弄清楚如何有效(diff)的更新 DOM
  - 使用 Virtual DOM 没有闪烁的效果 (只会更新数据发生变化的 dom 元素，没有变化的 dom 元素会重用)
- 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的描述
  - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
  - 通过比较前后两次状态的差异更新真实 DOM

### 1.1.3 虚拟 DOM 的作用

- 维护视图和状态的关系
  - 使用虚拟 DOM 可以记录上次状态的变化，只更新状态变化的位置就行了。
- 复杂视图情况下提升渲染性能
  - 并不是所有的时候使用虚拟 DOM 都会提高性能的，只有在视图比较复杂的情况下提升性能的。
- 除了渲染 DOM 以外，还可以实现 SSR(Nuxt.js/Next.js)、原生应用(Weex/React Native)、小程序(mpvue/uni-app)等

![avatar](../images/task4/虚拟DOM渲染平台类型.png)

## 1.2 - Virtual DOM 库

- [Snabbdom](https://github.com/snabbdom/snabbdom)

  - Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
  - 大约 200 SLOC(行代码)（single line of code)
  - 通过模块可扩展
    - 类似插件的机制
  - 源码使用 TypeScript 开发
  - 最快的 Virtual DOM

- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)

## 1.3 Snabbdom 的基本使用

### 1.3.1 创建项目

- 打包工具为了方便使用 parcel
- 创建项目，并安装 parcel

```js
# 创建项目目录
md snabbdom-demo
# 进入项目目录
cd snabbdom-demo
# 创建 package.json
yarn init -y
# 本地安装 parcel
yarn add parcel-bundler
```

- 配置 package.json 的 scripts

```js
"scripts": {
    "dev": "parcel index.html --open",
    "build": "parcel build index.html"
}
```

- 创建目录结构

```js
│ index.html
│ package.json
└─src
    01-basicusage.js
```

### 1.3.2 导入 Snabbdom

Snabbdom 文档

- 看文档的意义
  - 学习任何一个库都要先看文档
  - 通过文档了解库的作用
  - 看文档中提供的示例，自己快速实现一个 demo
  - 通过文档查看 API 的使用
- 文档地址
  [英文文档](https://github.com/snabbdom/snabbdom)
  [中文文档](https://github.com/coconilu/Blog/issues/152)

安装 Snabbdom

- 安装 Snabbdom

```js
yarn add Snabbdom
```

导入 Snabbdom

- Snabbdom 的官网 demo 中导入使用的是 commonjs 模块化语法，我们使用更流行的 ES6 模块
  化的语法 import
- 关于模块化的语法请参考阮一峰老师的 [Module](http://es6.ruanyifeng.com/#docs\module) 的语法
- [ES6 模块与 CommonJS 模块的差异](https://es6.ruanyifeng.com/#docs\module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

```js
import { init, h, thunk } from "snabbdom";
```

- Snabbdom 的核心仅提供最基本的功能，只导出了三个函数 init()、h()、thunk()
  - init() 是一个高阶函数，返回 patch()
  - h() 返回虚拟节点 VNode，这个函数我们在使用 Vue.js 的时候见过
  ```js
  // vue 的 render 里面就使用到了 h 函数
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
  ```
  - thunk() 是一种优化策略，可以在处理不可变数据时使用
- <font color="black">注意</font>：导入时候不能使用 import snabbdom from "snabbdom"
  - 原因：node_modules/src/snabbdom.ts 末尾导出使用的语法是 export 导出 API，没有使用 export default 导出默认输出
  ```js
      export {h} from "./h";
      export {thunk} from "./thunk";
      export funtion init(modules: Array<Partial<Module>>, domApi?: DOMAPI)...
  ```

### 1.3.3 代码演示

init 函数

- 参数
  - 模块数组
  - domApi
- 返回值： patch 函数，作用对比两个 vnode 的差异更新到真是 DOM
  h 函数
- 参数
  - 第 1 个参数： 标签+选择器
  - 第 2 个参数： 如果是字符串的话就是标签中的内容，如果是对象的话就是传递给模块的参数，那就需要第三个参数来指定标签中的内容
  - 第 3 个参数: 如果是字符串的话就是标签中的内容，如果是数组的话就是 Vnode 的数组，如果是 Vnode 的话就把它存到数组中，方便统一处理
- 返回值： VNode
  patch 函数
- 参数
  - 第 1 个参数：可以是 DOM 元素，内部会把 DOM 元素转换成 VNode
  - 第 2 个参数：VNode
- 返回值: VNode
- 作用：
  - 对比两个 VNode 的差异，并更新到真实 DOM，并且返回一个 VNode
  - 如果第 1 个参数不是 VNode，内部会把他转成 VNode
- 代码演示如下：

```js
// 1 使用 common.js 导入 snabbdom
// let snabbdom = require("snabbdom");

// 在 common.js 中所有的模块都会导出一个对象，可以使用一个变量来接受
// 如果导入的模块中没有使用 export default 的语法，就不能使用 import xx from "模块"
// 需要使用 import {} from "模块" 这种方式

// 2 使用 es6 导入 snabbdom
import { init, h, thunk } from "snabbdom";

// 3.1 案例  创建一个有 Hello Word 内容的 div 元素
// init 函数
// - 参数
//      - 数组
//      - 模块
// - 返回值： patch 函数，作用对比两个 vnode 的差异更新到真是 DOM
// h 函数
// - 参数
//      - 第1个参数： 标签+选择器
//      - 第2个参数： 如果是字符串的话就是标签中的内容，如果是数组就是子元素集合
//      - 第3个参数:  如果是字符串的话就是标签中的内容，如果是数组的话就是 Vnode 的数组，如果是 Vnode 的话就把它存到数组中，方便统一处理
// - 返回值： (Vnode)
// patch 函数
// - 参数
//      - 第1个参数：可以是 DOM 元素，内部会把 DOM 元素转换成 VNode
//      - 第2个参数：VNode
// - 返回值: VNode
let patch = init([]);
let vnode = h("div#big.cls", "Hello Word");
let app = document.querySelector("#app");
// 保存上一次 Vnode 的结果
let oldVnode = patch(app, vnode); // 对比两个 VNode 的差异，并更新到真实 DOM

// 假设我们替换掉之前的 oldVnode
vnode = h("div", "Hello Snabbdom");
patch(oldVnode, vnode);
```

- 在 div 中放置子元素 h1,p

```js
import { init, h, thunk } from "snabbdom";
// div 中放置子元素 h1,p
let patch = init([]);
let vnode = h("div#big.cls", [h("h1", "我是h1标签"), h("p", "我是p标签")]);
let app = document.querySelector("#app");
// 保存上一次 Vnode 的结果
let oldVnode = patch(app, vnode); // 对比两个 VNode 的差异，并更新到真实 DOM
// 2s 后更新之前的 Vnode
setTimeout(() => {
  vnode = h("div#big.cls", [h("h1", "hello h2"), h("p", "hello p")]);
  patch(oldVnode, vnode);
}, 2000);
// 2s 后清空页面元素
setTimeout(() => {
  // 官网上这个是错误的
  // patch(oldVnode, null);
  // 使用注释节点清空页面元素
  patch(oldVnode, h("!"));
}, 3000);
// Vnode -> dom
patch(oldVnode, vnode);
```

### 1.3.4 模块的使用

Snabbdom 的核心库并不能处理元素的属性/样式/事件等，如果需要处理的话，可以使用模块

常用模块

- 官方提供了 6 个模块
  - attributes
    - 设置 DOM 元素的属性，使用 setAttribute ()
    - 处理布尔类型的属性
  - props
    - 和 attributes 模块相似，设置 DOM 元素的属性 element[attr] = value
    - 不处理布尔类型的属性
  - class
    - 切换类样式
    - 注意：给元素设置类样式是通过 sel 选择器
  - dataset
    - 设置 data-\* 的自定义属性
  - eventlisteners
    - 注册和移除事件
  - style
    - 设置行内样式，支持动画
    - delayed/remove/destroy
- 也可以自己创建模块

模块使用

- 模块使用步骤：
  - 导入需要的模块
  - init() 中注册模块
  - 使用 h() 函数创建 VNode 的时候，可以把第二个参数设置为对象，其他参数往后移

代码演示

```js
// 模块使用步骤:

import { init, h, thunk } from "snabbdom";

// 1. 导入模块
// import hero from "snabbdom/modules/hero";    // 实例模块
import style from "snabbdom/modules/style";
import eventlisteners from "snabbdom/modules/eventlisteners";
// 2. 注册模块
let patch = init([style, eventlisteners]);
// 3. 使用 h() 函数的第2个参数传入模块需要的数据 (对象)

let vnode = h(
  "div#big.cls",
  {
    style: {
      backgroundColor: "blue",
      color: "green",
    },
    on: {
      click: handlerClick,
    },
  },
  [h("h1", "hello h2"), h("p", "hello p")]
);
function handlerClick() {
  alert("点击了");
}

let app = document.querySelector("#app");
// 保存上一次 Vnode 的结果
let oldVnode = patch(app, vnode); // 对比两个 VNode 的差异，并更新到真实 DOM
```

## 1.4 Snabbdom 的源码解析

### 1.4.1 概述

如何学习源码 **\***

- 先宏观了解
- 带着目标看源码
  - VNode 是如何创建的
  - VNode 是如何渲染成真实 DOM 的
- 看源码的过程要不求甚解
  - 围绕核心目标
- 调试
  - 写一个小的 demo 调试
- 参考资料
  - 参考别人写好的资料/文章

Snabbdom 的核心

- 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

Snabbdom 源码

- 源码地址：
  - https://github.com/snabbdom/snabbdom
- src 目录结构

![avatar](../images/task4/snabbdom-src的目录结构.png)

### 1.4.2 h 函数

- h() 函数
  - 在使用 Vue 的时候见过 h() 函数
  ```js
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
  ```
  - h() 函数最早见于 [hyperscript](https://github.com/hyperhype/hyperscript)，使用 JavaScript 创建超文本
  - Snabbdom 中的 h() 函数不是用来创建超文本，而是创建 VNode
- 函数重载
  - 概念
    - 参数个数或类型不同的函数
    - JavaScript 中没有重载的概念
    - TypeScript 中有重载，不过重载的实现还是通过代码调整参数
  - 重载的示意
  ```js
  function add (a, b) {
      console.log(a + b)
      }
      function add (a, b, c) {
      console.log(a + b + c)
      }
      add(1, 2)
      add(1, 2, 3)
  }
  ```
- 源码位置：src/h.ts

```js
// h 函数的重载
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData | null): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData | null, children:
    VNodeChildren): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
    var data: VNodeData = {}, children: any, text: any, i: number;
    // 处理参数，实现重载的机制
    if (c !== undefined) {
        // 处理三个参数的情况
        // sel、data、children/text
        if (b !== null) { data = b; }
        // 如果 c 是数组的话就是子元素
        if (is.array(c)) { children = c; }
        // 如果 c 是字符串或者数字
        else if (is.primitive(c)) { text = c; }
        // 如果 c 是 VNode
        else if (c && c.sel) { children = [c]; }
    } else if (b !== undefined && b !== null) {
        // 处理两个参数的情况
        // 如果 b 是数组
        if (is.array(b)) { children = b; }
        // 如果 b 是字符串或者数字
        else if (is.primitive(b)) { text = b; }
        // 如果 b 是 VNode
        else if (b && b.sel) { children = [b]; }
        else { data = b; }
    }
    if (children !== undefined) {
        // 处理 children 中的原始值(string/number)
        for (i = 0; i < children.length; ++i) {
            // 如果 child 是 string/number，创建文本节点
            if (is.primitive(children[i])) children[i] = vnode(undefined,
                undefined, undefined, children[i], undefined);
        }
    }
    if (
        sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
    ) {
        // 如果是 svg，添加命名空间
        addNS(data, children, sel);
    }
    // 返回 VNode
    return vnode(sel, data, children, text, undefined);
};
// 导出模块
export default h;
```

总结：

- h 函数的核心就是调用 vnode 函数返回一个虚拟 DOM

### 1.4.3 VNode

- 一个 VNode 就是一个虚拟节点用来描述一个 DOM 元素，如果这个 VNode 有 children 就是
  Virtual DOM
- 源码位置：src/vnode.ts

```js
export interface VNode {
  // 选择器
  sel: string | undefined;
  // 节点数据：属性/样式/事件等
  data: VNodeData | undefined;
  // 子节点，和 text 只能互斥
  children: Array<VNode | string> | undefined;
  // 记录 vnode 对应的真实 DOM
  elm: Node | undefined;
  // 节点中的内容，和 children 只能互斥
  text: string | undefined;
  // 优化用
  key: Key | undefined;
}
export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
): VNode {
  let key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
export default vnode;
```

### 1.4.4 snabbdom

path 的整体流程

- patch(oldVnode, newVnode)
- 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧 VNode 是否相同节点(节点的 key 和 sel 相同)
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

![avatar](../images/task4/snabbdom流程图.png)

#### 1.4.4.1 init

- 功能：init(modules, domApi)，返回 patch() 函数（高阶函数）
- 为什么要使用高阶函数？
  - 因为 patch() 函数再外部会调用多次，每次调用依赖一些参数，比如：
    modules/domApi/cbs
  - 通过高阶函数让 init() 内部形成闭包，返回的 patch() 可以访问到 modules/domApi/cbs，而不需要重新创建
- init() 在返回 patch() 之前，首先收集了所有模块中的钩子函数存储到 cbs 对象中
- 源码位置：src/snabbdom.ts

```js
// 钩子函数数组
const hooks: (keyof Module)[] = ['create', 'update', 'remove',
    'destroy', 'pre', 'post'];
export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
    let i: number, j: number, cbs = ({} as ModuleHooks);
    // 初始化 api       默认是 htmlDomApi 操作 dom 的 api
    const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;
    // 循环把传入的所有模块的钩子方法，统一存储到 cbs 对象中
    // 最终构建的 cbs 对象的形式 cbs = [ create: [fn1, fn2], update: [], ...]
    for (i = 0; i < hooks.length; ++i) {
        // cbs['create'] = []
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            // const hook = modules[0]['create']
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                (cbs[hooks[i]] as Array<any>).push(hook);
            }
        }
    }
    ……
    ……
    ……
    return function patch(oldVnode: VNode | Element, vnode: VNode): VNode { }
};

```

#### 1.4.4.2 patch

- 功能：
  - 传入新旧 VNode，对比差异，把差异渲染到 DOM
  - 返回新的 VNode，作为下一次 patch() 的 oldVnode
- 执行过程：
  - 首先执行模块中的钩子函数 pre
  - 如果 oldVnode 和 vnode 相同（key 和 sel 相同）
    - 调用 patchVnode()，找节点的差异并更新 DOM
  - 如果 oldVnode 是 DOM 元素
    - 把 DOM 元素转换成 oldVnode
    - 调用 createElm() 把 vnode 转换为真实 DOM，记录到 vnode.elm
    - 把刚创建的 DOM 元素插入到 parent 中
    - 移除老节点
    - 触发用户设置的 create 钩子函数
- 源码位置：src/snabbdom.ts

```js
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    let i: number, elm: Node, parent: Node;
    // 保存新插入节点的队列，为了触发钩子函数
    const insertedVnodeQueue: VNodeQueue = [];
    // 执行模块的 pre 钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
    // 如果 oldVnode 不是 VNode，创建 VNode 并设置 elm
    if (!isVnode(oldVnode)) {
        // 把 DOM 元素转换成空的 VNode
        oldVnode = emptyNodeAt(oldVnode);
    }
    // 如果新旧节点是相同节点(key 和 sel 相同)
    if (sameVnode(oldVnode, vnode)) {
        // 找节点的差异并更新 DOM
        patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
        // 如果新旧节点不同，vnode 创建对应的 DOM
        // 获取当前的 DOM 元素
        elm = oldVnode.elm!;
        parent = api.parentNode(elm);
        // 触发 init/create 钩子函数,创建 DOM
        createElm(vnode, insertedVnodeQueue);
        if (parent !== null) {
            // 如果父节点不为空，把 vnode 对应的 DOM 插入到文档中
            api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
            // 移除老节点
            removeVnodes(parent, [oldVnode], 0, 0);
        }
    }
    // 执行用户设置的 insert 钩子函数
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i]);
    }
    // 执行模块的 post 钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    // 返回 vnode
    return vnode;
};
```

#### 1.4.4.3 createElm

- 功能：
  - createElm(vnode, insertedVnodeQueue)，返回创建的 DOM 元素
  - 创建 vnode 对应的 DOM 元素
- 执行过程：
  - 首先触发用户设置的 init 钩子函数
  - 如果选择器是!，创建评论节点
  - 如果选择器为空，创建文本节点
  - 如果选择器不为空
    - 解析选择器，设置标签的 id 和 class 属性
    - 执行模块的 create 钩子函数
    - 如果 vnode 有 children，创建子 vnode 对应的 DOM，追加到 DOM 树
    - 如果 vnode 的 text 值是 string/number，创建文本节点并追击到 DOM 树
    - 执行用户设置的 create 钩子函数
    - 如果有用户设置的 insert 钩子函数，把 vnode 添加到队列中
- 源码位置：src/snabbdom.ts

```js
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {

    let i: any, data = vnode.data;
    if (data !== undefined) {
        // 执行用户设置的 init 钩子函数
        const init = data.hook?.init;
        if (isDef(init)) {
            init(vnode);
            data = vnode.data;
        }
    }
    let children = vnode.children, sel = vnode.sel;
    if (sel === '!') {
        // 如果选择器是!，创建评论节点
        if (isUndef(vnode.text)) {
            vnode.text = '';
        }
        vnode.elm = api.createComment(vnode.text!);
    } else if (sel !== undefined) {
        // 如果选择器不为空
        // 解析选择器
        // Parse selector
        const hashIdx = sel.indexOf('#');
        const dotIdx = sel.indexOf('.', hashIdx);
        const hash = hashIdx > 0 ? hashIdx : sel.length;
        const dot = dotIdx > 0 ? dotIdx : sel.length;
        const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0,
            Math.min(hash, dot)) : sel;
        const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
            ? api.createElementNS(i, tag)
            : api.createElement(tag);
        if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
        if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot +
            1).replace(/\./g, ' '));
        // 执行模块的 create 钩子函数
        for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode,
            vnode);
        // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                const ch = children[i];
                if (ch != null) {
                    api.appendChild(elm, createElm(ch as VNode,
                        insertedVnodeQueue));
                }
            }
        } else if (is.primitive(vnode.text)) {
            // 如果 vnode 的 text 值是 string/number，创建文本节点并追加到 DOM 树
            api.appendChild(elm, api.createTextNode(vnode.text));
        }
        const hook = vnode.data!.hook;
        if (isDef(hook)) {
            // 执行用户传入的钩子 create
            hook.create?.(emptyNode, vnode);
            if (hook.insert) {
                // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
                insertedVnodeQueue.push(vnode);
            }
        }
    } else {
        // 如果选择器为空，创建文本节点
        vnode.elm = api.createTextNode(vnode.text!);
    }
    // 返回新创建的 DOM
    return vnode.elm;
}
```

#### 1.4.4.4 patchVnode

- 功能：
  - patchVnode(oldVnode, vnode, insertedVnodeQueue)
  - 对比 oldVnode 和 vnode 的差异，把差异渲染到 DOM
- 执行过程：
  - 首先执行用户设置的 prepatch 钩子函数
  - 执行 create 钩子函数
    - 首先执行模块的 create 钩子函数
    - 然后执行用户设置的 create 钩子函数
  - 如果 vnode.text 未定义
    - 如果 oldVnode.children 和 vnode.children 都有值
      - 调用 updateChildren()
      - 使用 diff 算法对比子节点，更新子节点
    - 如果 vnode.children 有值， oldVnode.children 无值
      - 清空 DOM 元素
      - 调用 addVnodes() ，批量添加子节点
    - 如果 oldVnode.children 有值， vnode.children 无值
      - 调用 removeVnodes() ，批量移除子节点
    - 如果 oldVnode.text 有值
      - 清空 DOM 元素的内容
  - 如果设置了 vnode.text 并且和和 oldVnode.text 不等
    - 如果老节点有子节点，全部移除
    - 设置 DOM 元素的 textContent 为 vnode.text
  - 最后执行用户设置的 postpatch 钩子函数
- 源码位置：src/snabbdom.ts

```js
function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue:
    VNodeQueue) {
    const hook = vnode.data?.hook;
    // 首先执行用户设置的 prepatch 钩子函数
    hook?.prepatch?.(oldVnode, vnode);
    const elm = vnode.elm = oldVnode.elm!;
    let oldCh = oldVnode.children as VNode[];
    let ch = vnode.children as VNode[];
    // 如果新老 vnode 相同返回
    if (oldVnode === vnode) return;
    if (vnode.data !== undefined) {
        // 执行模块的 update 钩子函数
        for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode,
            vnode);
        // 执行用户设置的 update 钩子函数
        vnode.data.hook?.update?.(oldVnode, vnode);
    }
    // 如果 vnode.text 未定义
    if (isUndef(vnode.text)) {
        // 如果新老节点都有 children
        if (isDef(oldCh) && isDef(ch)) {
            // 使用 diff 算法对比子节点，更新子节点
            if (oldCh !== ch) updateChildren(elm, oldCh, ch,
                insertedVnodeQueue);
        } else if (isDef(ch)) {
            // 如果新节点有 children，老节点没有 children
            // 如果老节点有text，清空dom 元素的内容
            if (isDef(oldVnode.text)) api.setTextContent(elm, '');
            // 批量添加子节点
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
            // 如果老节点有children，新节点没有children
            // 批量移除子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
            // 如果老节点有 text，清空 DOM 元素
            api.setTextContent(elm, '');
        }
    } else if (oldVnode.text !== vnode.text) {
        // 如果没有设置 vnode.text
        if (isDef(oldCh)) {
            // 如果老节点有 children，移除
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        // 设置 DOM 元素的 textContent 为 vnode.text
        api.setTextContent(elm, vnode.text!);
    }
    // 最后执行用户设置的 postpatch 钩子函数
    hook?.postpatch?.(oldVnode, vnode);
}
```

#### 1.4.4.5 updateChildren

- 功能：
  - diff 算法的核心，对比新旧节点的 children，更新 DOM
- 执行过程：

  - 要对比两棵树的差异，我们可以取第一棵树的每一个节点依次和第二课树的每一个节点比
    较，但是这样的时间复杂度为 O(n^3)
  - 在 DOM 操作的时候我们很少很少会把一个父节点移动/更新到某一个子节点
  - 因此只需要找同级别的子节点依次比较，然后再找下一级别的节点比较，这样算法的时间复杂度为 O(n)

  ![avatar](../images/task4/snabbdom流程图.png)

  - 在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引
  - 在对开始和结束节点比较的时候，总共有四种情况

    - oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
    - oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
    - oldStartVnode / oldEndVnode (旧开始节点 / 新结束节点)
    - oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)

    ![avatar](../images/task4/updateChildren新老节点对比1.png)

  - 开始节点和结束节点比较，这两种情况类似
    - oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
    - oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
  - 如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)

    - 调用 patchVnode() 对比和更新节点
    - 把旧开始和新开始索引往后移动 oldStartIdx++ / oldEndIdx++

    ![avatar](../images/task4/updateChildren新老节点对比2.png)

  - oldStartVnode / newEndVnode (旧开始节点 / 新结束节点) 相同

    - 调用 patchVnode() 对比和更新节点
    - 把 oldStartVnode 对应的 DOM 元素，移动到右边
      - 更新索引

    ![avatar](../images/task4/updateChildren新老节点对比3.png)

  - oldEndVnode / newStartVnode (旧结束节点 / 新开始节点) 相同

    - 调用 patchVnode() 对比和更新节点
    - 把 oldEndVnode 对应的 DOM 元素，移动到左边
    - 更新索引

    ![avatar](../images/task4/updateChildren新老节点对比4.png)

  - 如果不是以上四种情况

    - 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
    - 如果没有找到，说明 newStartNode 是新节点
      - 创建新节点对应的 DOM 元素，插入到 DOM 树中
    - 如果找到了
      - 判断新节点和找到的老节点的 sel 选择器是否相同
      - 如果不相同，说明节点被修改了
        - 重新创建对应的 DOM 元素，插入到 DOM 树中
      - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

    ![avatar](../images/task4/updateChildren新老节点对比5.png)

  - 循环结束
    - 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)，循环结束
    - 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束
  - 如果老节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余，把剩余节点批量插入到右边

    ![avatar](../images/task4/updateChildren新老节点对比6.png)

  - 如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明老节点有剩余，把剩余节点批量删除

    ![avatar](../images/task4/updateChildren新老节点对比7.png)

- 源码位置：src/snabbdom.ts

```js
function updateChildren(
  parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue
) {
  let oldStartIdx = 0,
    newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx: KeyToIndexMap | undefined;
  let idxInOld: number;
  let elmToMove: VNode;
  let before: any;
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 索引变化后，可能会把节点设置为空
    if (oldStartVnode == null) {
      // 节点为空移动索引
      oldStartVnode = oldCh[++oldStartIdx];
      // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
      // 比较开始和结束节点的四种情况
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 1. 比较老开始节点和新的开始节点
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 2. 比较老结束节点和新的结束节点
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      // 3. 比较老开始节点和新的结束节点
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      api.insertBefore(
        parentElm,
        oldStartVnode.elm!,
        api.nextSibling(oldEndVnode.elm!)
      );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      // 4. 比较老结束节点和新的开始节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 开始节点和结束节点都不相同
      // 使用 newStartNode 的 key 再老节点数组中找相同节点
      // 先设置记录 key 和 index 的对象
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      // 遍历 newStartVnode, 从老的节点中找相同 key 的 oldVnode 的索引
      idxInOld = oldKeyToIdx[newStartVnode.key as string];
      // 如果是新的vnode
      if (isUndef(idxInOld)) {
        // New element
        // 如果没找到，newStartNode 是新节点
        // 创建元素插入 DOM 树
        api.insertBefore(
          parentElm,
          createElm(newStartVnode, insertedVnodeQueue),
          oldStartVnode.elm!
        );
        // 重新给 newStartVnode 赋值，指向下一个新节点
        newStartVnode = newCh[++newStartIdx];
      } else {
        // 如果找到相同 key 相同的老节点，记录到 elmToMove 遍历
        elmToMove = oldCh[idxInOld];
        if (elmToMove.sel !== newStartVnode.sel) {
          // 如果新旧节点的选择器不同
          // 创建新开始节点对应的 DOM 元素，插入到 DOM 树中
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!
          );
        } else {
          // 如果相同，patchVnode()
          // 把 elmToMove 对应的 DOM 元素，移动到左边
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined as any;
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
        }
        // 重新给 newStartVnode 赋值，指向下一个新节点
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  // 循环结束，老节点数组先遍历完成或者新节点数组先遍历完成
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // 如果老节点数组先遍历完成，说明有新的节点剩余
      // 把剩余的新节点都插入到右边
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(
        parentElm,
        before,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      );
    } else {
      // 如果新节点数组先遍历完成，说明老节点有剩余
      // 批量删除老节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
}
```

#### 1.4.4.6 调试 updateChildren

```js
<ul>
    <li>首页</li>
    <li>微博</li>
    <li>视频</li>
</ul>
<ul>
    <li>首页</li>
    <li>视频</li>
    <li>微博</li>
</ul>
```

![avatar](../images/task4/调试updateChildren.png)

#### 1.4.4.7 调试带 key 的情况

```js
<ul>
    <li key="a">首页</li>
    <li key="b">微博</li>
    <li key="c">视频</li>
</ul>
<ul>
    <li key="a">首页</li>
    <li key="c">视频</li>
    <li key="b">微博</li>
</ul>
```

#### 1.4.4.8 总结

通过以上调试 updateChildren，我们发现不带 key 的情况需要进行两次 DOM 操作，带 key 的情况只需要更新一次 DOM 操作(移动 DOM 项)，所以带 key 的情况可以减少 DOM 的操作，如果 li 中的子项比较多，更能体现出带 key 的优势。

### 1.4.5 Modules 源码

- patch() -> patchVnode() -> updateChildren()
- Snabbdom 为了保证核心库的精简，把处理元素的属性/事件/样式等工作，放置到模块中
- 模块可以按照需要引入
- 模块的使用可以查看[官方文档](https://github.com/snabbdom/snabbdom#modules-documentation)
- 模块实现的核心是基于 Hooks

#### 1.4.5.1 Hooks

- 预定义的钩子函数的名称
- 源码位置：src/hooks.ts

```js
export interface Hooks {
  // patch 函数开始执行的时候触发
  pre?: PreHook;
  // createElm 函数开始之前的时候触发
  // 在把 VNode 转换成真实 DOM 之前触发
  init?: InitHook;
  // createElm 函数末尾调用
  // 创建完真实 DOM 后触发
  create?: CreateHook;
  // patch 函数末尾执行
  // 真实 DOM 添加到 DOM 树中触发
  insert?: InsertHook;
  // patchVnode 函数开头调用
  // 开始对比两个 VNode 的差异之前触发
  prepatch?: PrePatchHook;
  // patchVnode 函数开头调用
  // 两个 VNode 对比过程中触发，比 prepatch 稍晚
  update?: UpdateHook;
  // patchVnode 的最末尾调用
  // 两个 VNode 对比结束执行
  postpatch?: PostPatchHook;
  // removeVnodes -> invokeDestroyHook 中调用
  // 在删除元素之前触发，子节点的 destroy 也被触发
  destroy?: DestroyHook;
  // removeVnodes 中调用
  // 元素被删除的时候触发
  remove?: RemoveHook;
  // patch 函数的最后调用
  // patch 全部执行完毕触发
  post?: PostHook;
}
```

#### 1.4.5.2 Modules

模块文件的定义

> Snabbdom 提供的所有模块在：src/modules 文件夹下，主要模块有：

- attributes.ts
  - 使用 setAttribute/removeAttribute 操作属性
  - 能够处理 boolean 类型的属性
- class.ts
  - 切换类样式
- dataset.ts
  - 操作元素的 data-\* 属性
- eventlisteners.ts
  - 注册和移除事件
- module.ts
  - 定义模块遵守的钩子函数
- props.ts
  - 和 attributes.ts 类似，但是是使用 elm[attrName] = value 的方式操作属性
- style.ts
  - 操作行内样式
  - 可以使动画更平滑
- hero.ts
  - 自定义的模块，examples/hero 示例中使用

attributes.ts

- 模块到出成员

```js
export const attributesModule = {create: updateAttrs,update: updateAttrs} as Module;export default attributesModul
```

- updateAttrs 函数功能
  - 更新节点属性
  - 如果节点属性值是 true 设置空置
  - 如果节点属性值是 false 移除属性
- updateAttrs 实现

```js
function updateAttrs(oldVnode: VNode, vnode: VNode): void {
    var key: string, elm: Element = vnode.elm as Element,
        oldAttrs = (oldVnode.data as VNodeData).attrs,
        attrs = (vnode.data as VNodeData).attrs;
    // 新老节点没有 attrs 属性，返回
    if (!oldAttrs && !attrs) return;
    // 新老节点的 attrs 属性相同，返回
    if (oldAttrs === attrs) return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    // 遍历新节点的属性
    for (key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        // 如果新老节点的属性值不同
        if (old !== cur) {
            // 布尔类型值的处理
            if (cur === true) {
                elm.setAttribute(key, "");
            } else if (cur === false) {
                elm.removeAttribute(key);
            } else {
                // ascii 120 -> x
                // <svg xmlns="http://www.w3.org/2000/svg">
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                } else if (key.charCodeAt(3) === colonChar) {
                    // ascii 120 -> :
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                } else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    // <svg xmlns:xlink="http://www.w3.org/1999/xlink">
                    elm.setAttributeNS(xlinkNS, key, cur);
                } else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it
    (.i.e.add even attributes with undefined value)
    // the other option is to remove all attributes with value ==
    undefined
    // 如果老节点的属性在新节点中不存在，移除
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
    export const attributesModule = {
        create: updateAttrs,
        update: updateAttrs
    } as Module;
    export default attributesModule;
}
```
