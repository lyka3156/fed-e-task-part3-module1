# 1. 模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

```js
// vue-router.js
// 在vue-router的history模块实现中改以下几个地方就可以了

// 获取当前 hash 串
getHash() {
    return window.location.hash.slice(1) || "/";
}

// 设置当前路径
onHashChange() {
    this.data.current = this.getHash(); // 重新设置当前路由路劲
}

// 1. init 方法中
// 在此方法中初始化路由映射表对象、事件、组件
init() {
    // 页面加载的时候就改变hash地址，并触发hashChange方法
    // 这样的话页面刷新的话，当前地址的hash值还存在
    window.addEventListener("load", () => {
        this.data.current = this.getHash(); // 重新设置当前路由路劲
        window.location.hash = this.getHash(); // 改变hash地址
    });
}

// 2. 创建 router-link 组件中a标签的单击事件中改变hash来切换浏览器中的地址，并把当前地址记录到浏览器的访问历史中，会触发hashchange方法
handleClick(e) {
    e.preventDefault(); // 禁用掉 a 标签的默认事件，a标签的默认事件会向服务器发送请求
    window.location.hash = this.to; // 通过 location.url 来切换浏览器中的地址，并把当前地址记录到浏览器的访问历史中，会触发hashchange方法
},

// 3. 在调用浏览器的前进和后退时执行，或者hashchange改变时执行
window.addEventListener("hashchange", this.onHashChange.bind(this));
```

# 2. 在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

```js
// 1. v-html的实现
htmlUpdate(node, value, prop) {
    console.log(node, value, prop);
    // 首次渲染v-html中的值
    node.innerHTML = value;
    // 当数据变化后重新渲染视图
    // 处理v-html指令的时候创建watcher对象
    let watcher = new Watcher(this.vm, prop, (newValue) => {
        node.innerHTML = newValue;
    });
}

// 2. v-on的实现
onUpdate(node, value, prop, eventName) {
    // 绑定事件
    node.addEventListener(eventName, () => {
        this.vm.$options.methods[prop] && this.vm.$options.methods[prop]();
    });
}

 /**
 * 负责编译元素的指令
 * @param {*} node 节点对象
 * @param {*} attrName 指令的名称
 * @param {*} prop 指令对应的属性名
 */
// update方法需要修改下
update(node, attrName, prop) {
    let [newAttrName, eventName] = attrName.split(":"); // 获取属性名和:后面的事件名
    let updateFn = this[newAttrName + "Update"]; // 获取编译指令的方法
    updateFn && updateFn.call(this, node, this.vm[prop], prop, eventName);
}
```

# 3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果，如图：

```js
import { init, h } from "snabbdom";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventListenersModule from "snabbdom/modules/eventlisteners";
import { originalData } from "./data"; // 引入原始数据

let patch = init([classModule, propsModule, styleModule, eventListenersModule]); // 调用init方法，注入模块，并接受一个返回的patch函数

let vnode; // 虚拟节点
let nextKey = 11; // 下一个的key
let margin = 8; // 边距
let sortBy = "rank"; // 默认排序字段
let totalHeight = 0; // 渲染的list总高度
let data = [...originalData]; // 初始化数据

// 排序
function changeSort(prop) {
  sortBy = prop; // 重置排序字段
  data.sort((a, b) => (a[prop] === b[prop] ? 0 : a[prop] > b[prop] ? 1 : -1)); // 升序
  render();
}
// 添加电影
function add() {
  let move = originalData[Math.floor(Math.random() * 10)]; // 随机获取电影列表
  data.unshift({ ...move, rank: nextKey++ }); // 在最前面添加一项数据
  // 重新渲染数据
  render();
  //   render();
}

// 移除当前行
function remove(movie) {
  data = data.filter((m) => m !== movie); // 过滤选中的数据
  // 重新渲染数据
  render();
}

// 创建 movie list 的vnode
function movieView(movie) {
  return h(
    "div.row",
    {
      key: movie.rank,
      style: {
        opacity: "0",
        transform: "translate(-200px)",
        delayed: { transform: `translateY(${movie.offset}px)`, opacity: "1" }, // 设置 每项y轴的距离
        // 设置动画
        remove: {
          opacity: "0",
          transform: `translateY(${movie.offset}px) translateX(200px)`,
        },
      },
      hook: {
        // 在insert钩子函数中能拿到vnode
        insert: (vnode) => {
          movie.elmHeight = vnode.elm.offsetHeight; // 设置每个电影所占高度
        },
      },
    },
    [
      h("div", { style: { fontWeight: "bold" } }, movie.rank),
      h("div", movie.title),
      h("div", movie.desc),
      h("div.btn.rm-btn", { on: { click: [remove, movie] } }, "x"), // 删除按钮
    ]
  );
}

// btn 数组
const btnArray = [
  { sort: "rank", content: "Rank" },
  { sort: "title", content: "Title" },
  { sort: "desc", content: "Description" },
];

// 创建头部的vnode
function titleVnode(data) {
  return h("div", [
    h("h1", "Top 10 movies"), // 标题
    // 操作按钮
    h("div", [
      h("a.btn.add", { on: { click: add } }, "Add"),
      "Sort by: ",
      h(
        "span.btn-group",
        btnArray.map(({ sort, content }) => {
          return h(
            `a.btn.${sort}`,
            {
              class: { active: sortBy === sort }, // 设置选中的样式
              on: { click: [changeSort, sort] },
            },
            content
          );
        })
      ),
    ]),
    // 电影列表
    h(
      "div.list",
      { style: { height: totalHeight + "px" } },
      data.map(movieView)
    ),
  ]);
}

//  调用渲染方法渲染数据
function render() {
  data = data.reduce((newData, next) => {
    let last = newData[newData.length - 1]; // 获取最后一项
    next.offset = last ? last.offset + last.elmHeight + margin : margin; // 获取每项距离最后一项的距离
    return [...newData, next]; // 返回新的data
  }, []);
  totalHeight = data[data.length - 1].offset + data[data.length - 1].elmHeight; // 获取总高度
  // 对比之前titleVnode生成的vnode 和 现在titleVnode生成的vnode的差异，渲染dom
  vnode = patch(vnode, titleVnode(data));
}

// 当初始的 HTML 文档被完全加载和解析完成之后,DOMContentLoaded 事件被触发,而无需等待样式表、图像和子框架的完成加载。
window.addEventListener("DOMContentLoaded", () => {
  let container = document.getElementById("container");
  // 初始化渲染数据
  vnode = patch(container, titleVnode(data)); // 对比新，旧两个vnode的差异，渲染dom，返回vnode，作为下次对比的旧vnode
  //   console.log(vnode);
  // 渲染数据
  render();
});
```
