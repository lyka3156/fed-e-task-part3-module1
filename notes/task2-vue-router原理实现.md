# 1. vue-router 的原理实现

[插件实现](https://cn.vuejs.org/v2/guide/plugins.html)

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

```js
// 1. route/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Layout from "../components/Layout.vue";
import Home from "../views/Home.vue";

// 1. 注册路由插件
// Vue.use 是用来注册插件，他会调用传入对象的 install 方法
Vue.use(VueRouter);

// 2. 定义路由规则数组
const routes = [
  // 登录页
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  // Home和Detail路由都嵌套在Layout路由下面
  // home和datail都在layout路由包裹住了
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "home",
        component: Home,
      },
      {
        path: "detail/:id",
        name: "detail",
        props: true,
        component: () => import("../views/Detail.vue"),
      },
    ],
  },
];

// 3. 创建 router对象
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

### 1.1.4 编程式导航

跳转路由的两种方式

- 根据路由规则的 path 跳转(字符串) this.\$router.push("/");
- 根据路由规则的 name 跳转(对象)

push 方法会把当前路由的 path 记录到历史，replace 方法不会。

路由传参

- 通过对象的 params 传参

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="push">跳转路由</button>
  </div>
</template>
<script>
export default {
  name: "About",
  methods: {
    push() {
      // 1. 跳转路由的两种方式
      // 1.1 根据路由规则的path跳转(字符串)  this.$router.push("/");
      // 1.2 根据路由规则的name跳转(对象)
      // this.$router.push({
      //   name: "home"
      // });

      // 2. replace方法不会把当前路由的路劲记录到历史
      // this.$router.replace("/");

      // 3. 路由传参
      this.$router.push({
        name: "detail",
        params: { id: 2 },
      });
    },
  },
};
</script>
```

## 1.2 Hash 模式 和 History 模式

不管哪种模式，都是客户端路由实现的方式，也就是当路劲发生变化时不会向服务器发送请求，使用 js 监听路由的变化，然后根据不同的地址渲染不同的内容。如果需要服务器端的内容的话，会发送 ajax 请求来获取。

表现形式的区别

- Hash 模式
  - https://lagou.com/#/pay?id=234242
  - #后面跟的是路由地址，可以根据?传递参数
- History 模式
  - https://lagou.com/pay/234242
  - history 模式就是一个正常的 url，他需要服务端的配合使用。

原理的区别

- Hash 模式是基于锚点，以及 onHashChange 事件
  - 通过锚点的值作为路由地址，当地址发生变化后触发 onHashChange 事件，在这里根据路劲决定页面呈现的内容
- History 模式是基于 HTML5 中的 History API
  - history.pushState() IE10 以后才支持
  - history.replaceState()
  - histroy 的 pushState 方法和 push 方法的区别是，push 方法路劲发生变化会向服务器发送请求，pushState 方法不会向服务器发送请求，只会去改变浏览器中地址栏中的地址，并且把这个地址记录到历史记录来，通过 pushState 可以实现客户端路由，有兼容问题，只兼容 IE10 以上

### 1.2.1 Histroy 模式的使用

- History 需要服务器的支持
- 单页应用中，服务端端不存在 http://www.testurl.com/login 这种的地址会返回找不到该页面，如果正常访问不会有任何问题，但是，浏览器在当前页面刷新浏览器的话会向服务器发送请求，去请求/login 这个页面，而服务器端不存在这个页面，于是返回 404
- 在服务器端应该除了静态资源外都返回单页应用的 index.html

## 1.3 模拟实现自己的 Vue Router

### 1.3.1 前置的知识：

- [插件](https://cn.vuejs.org/v2/guide/plugins.html)

  插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制,一般有下面几种：

  - 添加全局方法或者 property。如：vue-custom-element
  - 添加全局资源：指令/过滤器/过渡等。如 vue-touch
  - 通过全局混入来添加一些组件选项。如 vue-router
  - 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
  - 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

- 混入 mixin
- Vue.observable()
- slot 插槽 slot
- render 函数
- 运行时和完整版的 Vue

### 1.3.2 Vue-Router 的实现原理

#### 1.3.2.1 Hash 模块

- URL 中 # 后面的内容作为路劲地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应组件重新渲染
- 总结： 把 URL 中 # 后面的内容作为我们路由地址，我们可以直接通过 location.url 来切换浏览器中的地址，如果只改变了 # 后面的内容，浏览器不会向服务器请求这个地址，但是它会把这个地址记录到浏览器的访问历史中，当 hash 改变后我们会监听 hash 的变化，并做相应的处理。我们只需要监听 hashchange 事件，当 hash 发生改变后会触发 hashchange 这个事件，hashchange 事件中记录当前路由地址，并找到改路由对应的组件，并重新渲染

#### 1.3.2.2 Histroy 模式

- 通过 history.pushState() 方法改变地址栏
- 监听 popstate 事件
- 根据当前路由地址找到对应组件重新渲染
- 总结：history 的路劲就是一个普通的 url, 我们通过 history.pushState() 方法来改变地址栏，pushState 方法仅仅是改变地址栏，并把当前地址记录到浏览器的访问历史中，并不会真正的跳转到指定的路劲，也就是浏览器不会向服务器发送请求，通过监听 popstate 事件，可以监听到浏览器历史操作的变化，在 popstate 的处理函数中，可以记录改变后的地址，要注意的是调用 pushstate 或者 replaceState 的时候并不会触发该事件，当点击浏览器的前进和后退的时候或者调用 histroy 的 back 和 forward 的时候该事件才会被触发，最后当地址改变后要根据当前的地址找到对应的组件并重新渲染。

#### 1.3.3 Vue Router 实现思路：

##### 1.3.3.1 分析 Vue Router

```js
// router/index.js
// 注册插件
// 1. Vue.use 传入函数直接调用函数，传入的是对象，就直接调用对象的install方法
Vue.use(VueRouter);
// 创建路由对象
// 2. VueRouter可以被实例化 ，参数是一个对象
const router = new VueRouter({
  routes: [{ name: "home", path: "/", component: Home }],
});

// main.js
// 创建 Vue 实例，注册 router
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```

通过上述 Vue-Router 的使用分析所得

- VueRouter 有一个 静态 install 方法
- VueRouter 是一个类，参数是一个对象

VueRouter 类图如下：

![avatar](../images/taks2/VueRouter类图.png)

类图由 3 部分组成

1. 类的名称

- VueRouter

2. 类的属性

- options: 记录构造函数中传递的对象 (传入的路由规则)
- data: 对象
  - curent: 记录当前路由地址的
  - 设置 data 的目的是我们需要一个响应式的对象，也就是 data 对象是响应式的对象，因为路由地址发生变化之后，对应的组件需要自动更新。 (Vue.observable()使对象变成响应式对象)
- routeMap: 记录路由地址和组件的对应关系，把路由规则解析到 routeMap 对象中来

3. 类的方法

- Constructor 帮我们实现初始化的属性
- install 静态方法 实现 Vue 的插件机制
- init 用来调用下面 3 个方法，这里是把不同的代码分割到不同的方法中实现。
- initEvent 用来注册 popstate 事件，用来监听浏览器的历史变化
- createRouteMap 用来初始化 routeMap 属性的，它把构造函数中传递的路由规则转换成健值对的形式存到 routeMap 对象中来，key 就是路由地址 value 就是路由组件
- initComponents 用来创建 router-view 和 router-link 这两个组件的

##### 1.3.3.3 实现 Vue Router

1. 实现 Vue-Router 的 静态方法 install (用来创建 Vue 插件)

- 判断插件是否安装，如果已经安装了就不需要再安装了
- 把 Vue 的构造函数中记录到全局变量中来，因为当前的 install 方法是静态方法，静态方法是通过类访问的，那时候对象还没实例化所以拿不到静态方法中的值
- 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实例上 (注意：只执行一次)
- 代码实现如下：

```js
export default class VueRouter {
  // 1.VueRouter有一个静态方法install
  // 通过install安装VueRouter
  static install(Vue) {
    // 1.1) 判断插件是否安装，如果已经安装了就不需要再安装了
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true; // 标识安装过次插件

    // 1.2) 把Vue的构造函数存到全局变量，因为实例对象无法访问到静态方法中的值
    // 后续创建Vue的组件(router-view/router-link)时要用到
    _Vue = Vue;

    // 1.3) 把创建 Vue 实例时传入的router对象注入到所有 vue 实例上
    // 1.3.1) 我们之前使用的 $route 和 $router 就是在这时注入到 vue 实例上的
    // 通过this.$options.router拿到router对象，但是，此处的this是VueRouter，而不是vue实例，所以不能这样来
    // _Vue.prototype.$router = this.$options.router;

    // 我们应该在能获取到vue实例的时候写上面一段代码
    // 混入: 给所有 vue 实例混入一个选项，在这个选项里面设置一个beforeCreate
    // 在beforeCreate这个钩子函数中就能获取到 vue 实例，然后给它的原型设置$router
    _Vue.mixin({
      // 注意：vue实例 和 vue组件都会执行beforeCreate这个钩子函数
      beforeCreate() {
        // 这里面的this就是 vue 实例 或者 vue 的组件
        // 通过判断，只给 vue 实例注入这个$router属性，vue 组件不注入
        // 作用：在使用 new Vue({router}) 创建 vue 实例之前把router这个选项赋值给Vue的原型上面，以便后续所有的vue实例使用
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
}
```

2. 实现 Vue-Router 的 constructor 钩子函数

- 初始化 VueRouter 的 options、routeMap、data
  - options: 记录构造函数传递的 options 属性
  - routeMap: key 存取路由地址 value 存取路由组件
  - data: 响应式对象
    - current 用来记录我们当前的路由地址，默认是 /
- 代码实现如下：

```js
constructor(options) {
  this.options = options; // 记录options属性
  this.routeMap = {}; // key 存取路由地址  value 存取路由组件
  // data: 响应式对象
  // current 用来记录我们当前的路由地址，默认是 / 根路劲
  this.data = _Vue.observable({
    current: "/",
  });
}
```

3. 实现 createRouteMap(或者叫 initRouteMap) 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中

```js
// 3. createRouteMap
// 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
initRouteMap() {
  this.options.routes.forEach((route) => {
    this.routeMap[route.path] = route.component;
  });
}
```

4. 实现 initEvent: 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径

```js
// 4. initEvent
// 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径，不会向服务器发送请求
initEvent() {
  // 调用浏览器的前进和后退时执行
  window.addEventListener("popstate", () => {
    this.data.current = window.location.pathname;   // 重新设置当前路由路劲
  });
}
```

5. 实现 initComponent: 创建 router-link 和 router-view 组件

```js
  // 5. initComponent
  // 创建 router-link 和 router-view 组件
  initComponent() {
    // 5.1 创建 router-link  组件
    // 作用： 通过点击a标签，触发事件改变当前路由的地址
    Vue.component("router-link", {
      // 属性
      props: {
        to: String,
      },
      // template: '<a :href="to"><slot></slot></a>' // 运行时版本vue不支持template
      // 组件渲染的方法
      render(h) {
        // 返回一个a标签
        return h(
          "a",
          {
            // 添加标签的属性
            attrs: {
              href: this.to,
            },
            // 添加标签的事件
            on: {
              click: this.handleClick,
            },
          },
          [this.$slots.default] // 拿到插槽中的children并渲染  （a标签中的内容）
        );
      },
      methods: {
        handleClick(e) {
         e.preventDefault(); // 禁用掉 a 标签的默认事件，a标签的默认事件会向服务器发送请求
          window.history.pushState({}, "", this.to); // 通过pushState方法改变浏览器的地址栏，并把当前地址记录到浏览器的访问历史中，会触发popstate
          this.$router.data.current = this.to; // 重新设置当前路由路劲
        },
      },
    });
    const self = this;
    // 5.2 创建 router-view 组件
    Vue.component("router-view", {
      render(h) {
        // 通过当前路由地址拿到路由组件
        const component = self.routeMap[self.data.current];
        // 最后把路由组件渲染出来
        return h(component);
      },
    });
  }
```

6. 实现 init 方法

```js
// 6. 实现 init
// 在此方法中初始化路由映射表对象、事件、组件
init() {
  this.initRouteMap();
  this.initEvent();
  this.initComponent();
}
static install(Vue){
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true; // 标识安装过次插件
    _Vue = Vue;

    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          // 6. 调用init方法初始化需要的数据
          this.$options.router.init();
        }
      },
    });
}
```

## 1.3 Vue 的构建版本

- 运行时版：不支持 template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数

### 1.3.1 使用完整版的 Vue

创建 vue.config.js

```js
// vue.config.js
module.exports = {
  // Vue 的构建版本   默认false 运行时版的vue  true 代表完整版的vue
  // 运行时版：不支持 template 模板，需要打包的时候提前编译
  // 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数
  runtimeCompiler: true,
};
```

## 1.4 附录

https://www.jianshu.com/p/4295aec31302
https://zhuanlan.zhihu.com/p/27588422
