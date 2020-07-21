# 1. vue-router 的原理实现

## 1.1 Vue Router 基础使用

### 1.1.1 Vue Router 的使用步骤

前提是创建一些组件，好让路由规则的 path 映射 component

1. 注册路由插件

- vue.use 是用来注册插件，传递参数
- 如果参数是一个函数的话，Vue.use 内部直接调用这个函数来注册插件
- 如果参数是一个对象的话，他会调用传入对象的 install 方法来注册插件

2. 定义路由规则数组

- path 改变，会调用对应的 component

3. 创建 router 对象

   - 通过 vue-router 创建一个 router 对象，创建 router 对象的时候需要把路由规则数组传递过来，然后导出这个路由对象

4. 注册路由对象

   - 在创建 vue 实例的时候，注册一下 router 对象

5. 创建路由组件的占位

   - 路由规则 path 对应的 component 显示的地方

6. 创建链接
   - 路由规则中定义的 path

```js
// router/index.js 中注册路由插件，定义路由规则，创建路由对象并导出
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
// 1. 注册路由插件
Vue.use(VueRouter);

// 2. 定义路由规则数组
// path改变了，会调用对应的component
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];
// 3. 创建 router对象
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// 3.1 导出路由对象
export default router;

// main.js 中注册路由对象
import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // 导入路由对象

Vue.config.productionTip = false;

new Vue({
  // 4. 注册路由对象
  router,
  render: (h) => h(App),
}).$mount("#app");

// app.vue 中使用路由
<template>
  <div id="app">
    <div id="nav">
      <!-- 6.创建链接:  路由规则中定义的path -->
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <!-- 5.创建路由组件的占位: 路由规则path对应的component显示的地方 -->
    <router-view />
  </div>
</template>
```

讨论一下： 创建 vue 实例的时候传入 router 对象的作用是什么

- 当我们创建 vue 实例的时候，我们配置上 router 对象这个选项，他会给 vue 实例分别注入$route和$router 这两个属性。
- \$route 存取的是我们当前路由的路由规则(属性)
  - name,path,hash,params,query,meta,matched,fullPath
- \$router 存取的是一些路由方法
  - push,replase,go,forward,back
  - mode 当前路由模式 hash/history
  - currentRoute 拿到\$route(当前路由的规则)

```js
// main.js 中注册路由对象
import Vue from "vue";
import App from "./App.vue";
// import router from "./router"; // 导入路由对象

Vue.config.productionTip = false;

const vm = new Vue({
  // 4. 注册路由对象
  // router,
  render: (h) => h(App),
}).$mount("#app");

console.log(vm);
```

### 1.1.2 动态路由

1. 动态路由通过一个占位来匹配我们变化的位置

```js
// router/index.js
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/detail/:id", // 动态路由通过一个占位来匹配我们变化的位置
    name: "Detail",
    props: true, // 会把url中的参数传递给相应的组件，而在组件中通过props接受这个参数就可以了
    // 使用路由懒加载加载组件，当用户访问这个路由地址的时候才会加载对应的组件，用户不访问的时候不会加载这个组件
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Detail.vue"),
  },
];
```

2. 获取动态路由的传递的参数的两种方法

1. 通过当前路由规则，获取数据
   - 这种方式不太好，使用组件的时候必须有路由传递过参数，组件依赖路由，我们可以使用下面的方式降低这种依赖。
1. 路由规则中开启 props 传参
   - 我们可以让这种组件不依赖于路由
   - 在组件中接受 url 的参数就跟父子组件传值是一样的,通过 props 来接受这个参数

```vue
// Detail.Vue 中获取动态路由传递的参数
<template>
  <div class="detail">
    <h1>This is an Detail page</h1>

    <!-- 方法1：通过当前路由规则，获取数据 -->
    方法1 通过当前路由规则获取: {{ $route.params.id }}
    <br />
    <!-- 方法2： 路由规则中开启 props 传参 -->
    方法2 通过开启 props 获取: {{ $route.params.id }}
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["id"], // 通过props接受路由的url的参数
};
</script>
```

### 1.1.3 嵌套路由

当多个路由有相同的内容，把相同的内容提取到公共组件中。

![avatar](../images/task2/嵌套路由.png)

## 1.2 Hash 模式 和 History 模式

## 1.3 模拟实现自己的 Vue Router
