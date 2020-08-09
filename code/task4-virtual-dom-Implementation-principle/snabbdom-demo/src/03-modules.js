// 模块使用步骤:

import { init, h, thunk } from "snabbdom";

// 1. 导入模块      
// import hero from "snabbdom/modules/hero";    // 实例模块
import style from "snabbdom/modules/style";
import eventlisteners from "snabbdom/modules/eventlisteners";
// 2. 注册模块
let patch = init([
    style,
    eventlisteners
]);
// 3. 使用 h() 函数的第2个参数传入模块需要的数据 (对象)

let vnode = h("div#big.cls", {
    style: {
        backgroundColor: "blue",
        color: "green"
    },
    on: {
        click: handlerClick
    }
}, [
    h("h1", "hello h2"),
    h("p", "hello p")
]);
function handlerClick() {
    alert("点击了");
}

let app = document.querySelector("#app");
// 保存上一次 Vnode 的结果
let oldVnode = patch(app, vnode);       // 对比两个 VNode 的差异，并更新到真实 DOM
