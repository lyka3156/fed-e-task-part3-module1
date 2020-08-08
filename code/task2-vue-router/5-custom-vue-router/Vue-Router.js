// 1. Vue.use 是用来注册插件，
// 传入的是对象，他会调用传入对象的 install 方法
// 传入的是函数，他会直接执行函数
// 1. 通过上述知道VueRouter有一个静态方法install

// 2. 实例化VueRouter对象需要传递一个options对象
// 对象里面有mode,base,router是路由规则数组

// 3. 实现 createRouteMap(或者叫 initRouteMap)
// 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中

// 4. 实现 initEvent
// 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径

// 5. 实现 initComponent
// 创建 router-link 和 router-view 组件

// 6. 实现 init
// 在此方法中初始化路由映射表对象、事件、组件

let _Vue = null;

// 1. VueRouter 是一个构造函数
class VueRouter {
  // 2. 构造函数需要传递一个options对象
  // 初始化 VueRouter 的 options、routeMap、data
  constructor(options) {
    this.options = options; // 记录options属性
    this.routeMap = {}; // key 存取路由地址  value 存取路由组件
    // data: 响应式对象
    // current 用来记录我们当前的路由地址，默认是 / 根路劲
    this.data = _Vue.observable({
      current: "/",
    });


  }

  // 1.VueRouter有一个静态方法install
  // 通过install安装VueRouter
  static install(Vue) {
    // 1.1) 判断当前插件是否安装过，安装过直接返回不安装
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
          // 6. 调用init方法初始化需要的数据
          this.$options.router.init();
        }
      },
    });
  }

  // 3. createRouteMap
  // 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
  initRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }

  // 4. initEvent
  // 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径，不会向服务器发送请求
  initEvent() {
    // 调用浏览器的前进和后退时执行
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;   // 重新设置当前路由路劲
    });
  }

  // 5. initComponent
  // 创建 router-link 和 router-view 组件
  initComponent() {
    // 5.1 创建 router-link  组件
    // 作用： 通过点击a标签，触发事件改变当前路由的地址
    _Vue.component("router-link", {
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
    _Vue.component("router-view", {
      render(h) {
        // 通过当前路由地址拿到路由组件
        const component = self.routeMap[self.data.current];
        // 最后把路由组件渲染出来
        return h(component);
      },
    });
  }

  // 6. 实现 init
  // 在此方法中初始化路由映射表对象、事件、组件
  init() {
    this.initRouteMap();
    this.initEvent();
    this.initComponent();
  }
}

export default VueRouter;
