import { init, h, thunk } from "snabbdom";

// div 中放置子元素 h1,p
let patch = init([]);
let vnode = h("div#big.cls", [
    h("h1", "我是h1标签"),
    h("p", "我是p标签")
]);
let app = document.querySelector("#app");
// 保存上一次 Vnode 的结果
let oldVnode = patch(app, vnode);       // 对比两个 VNode 的差异，并更新到真实 DOM


// 2s 后更新之前的 Vnode
setTimeout(() => {
    vnode = h("div#big.cls", [
        h("h1", "hello h2"),
        h("p", "hello p")
    ]);
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


