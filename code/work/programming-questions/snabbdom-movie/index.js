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
