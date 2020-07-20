import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

// 1. 注册路由插件
// Vue.use 是用来注册插件，他会调用传入对象的 install 方法
Vue.use(VueRouter);

// 2. 定义路由规则数组
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

export default router;
