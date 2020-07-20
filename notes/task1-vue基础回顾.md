# 1. vue 基础回顾

## 1.1 vue 基础结构

vue 的 el 的用法

vue 会把 data 中的数据填充到 el 指定的模板中，并把模板渲染到浏览器。

```html
<body>
  <div id="app">
    <p>公司名称：{{ company.name }}</p>
    <p>公司地址：{{ company.address }}</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

  <script>
    new Vue({
      el: "#app",
      data: {
        company: {
          name: "上海复深蓝",
          address: "盛大天地源创谷",
        },
      },
    });
  </script>
</body>
```

vue 的 render 方法渲染 html

render 方法接受一个 h 函数，h 函数的作用是创建虚拟 dom，render 方法把 h 函数创建的虚拟 dom 返回，\$mount 方法的作用是把虚拟 dom 转换为真实 dom 渲染到浏览器。

```html
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

  <script>
    new Vue({
      data: {
        company: {
          name: "上海复深蓝",
          address: "盛大天地源创谷",
        },
      },
      render(h) {
        return h("div", { attrs: { id: "root" }, class: { rootcla: true } }, [
          h("p", "公司名称：" + this.company.name),
          h("p", "公司地址：" + this.company.address),
        ]);
      },
    }).$mount("#app");
  </script>
</body>
```

## 1.2 Vue 的生命周期

vue 中的生命周期

![avatar](../images/taks1/vue-lifecycle.png)

1. beforeCreate 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。
2. created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。这里没有\$el
3. beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。
4. mounted el 被新创建的 vm.\$el 替换，并挂载到实例上去之后调用该钩子。
5. beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
6. updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
7. beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。
8. destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。

钩子函数中该做的事情

1. created 实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。
2. mounted 实例已经挂载完成，可以进行一些 DOM 操作
3. beforeUpdate 可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
4. updated 可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。 该钩子在服务器端渲染期间不被调用。
5. beforeDestroy 可以执行一些优化操作,清空定时器，解除绑定事件

## 1.3 语法和概念

- 插值表达式 {{name}}
- 指令 14 个
- 自定义指令
- 计算属性和侦听器
- Class 和 Style 绑定
- 条件渲染/列表渲染
  - v-if v-else
  - v-for
- 表单输入绑定
  - v-bind
- 组件
  - 可复用的 vue 实例
- 插槽
  - 可以让我们在自定义组件中挖一个坑，使用这个组件的时候取填坑，这种做的目的是让组件更灵活。
  - 例如： vue-router 里的 route-view 组件，他里面的文本在外部使用的时候传进来的，内部就是使用插槽来占位的。
- 插件
  - vue-router
  - vuex
  - 可以开发自己的插件 例如：实现 vue-router...
- 混入 mixin
  - 如果多个组件有相同的选项，就可以通过 mixin 的方式，把相同的选项进行合并，让代码重用，这是让组件重用的一种方式。
- 深入响应式原理
- 不同构建版本的 vue
  - vue 打包之后会生成不同版本的 vue,他支持不同模块化的方式，以及带编辑器和不带编辑器版本的 vue
