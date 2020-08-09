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
//      - 模块数组
// - 返回值： patch 函数，作用对比两个 vnode 的差异更新到真是 DOM
// h 函数
//  - 参数
//      - 第1个参数： 标签+选择器
//      - 第2个参数： 如果是字符串的话就是标签中的内容
// patch 函数
// - 参数
//      - 第1个参数：可以是 DOM 元素，内部会把 DOM 元素转换成 VNode
//      - 第2个参数：VNode
// - 返回值: VNode
let patch = init([]);
let vnode = h("div#big.cls", "Hello Word");
let app = document.querySelector("#app");
let oldVnode = patch(app, vnode);       // 对比两个 VNode 的差异，并更新到真实 DOM

// 假设我们替换掉之前的 oldVnode
vnode = h("div", "Hello Snabbdom");
patch(oldVnode, vnode);

