import Vue from "vue";
// import VueRouter from "vue-router";
import VueRouter from "../../Vue-Router";
import Home from "../views/Home.vue";

// Vue.use 是用来注册插件，
// 传入的是对象，他会调用传入对象的 install 方法
// 传入的是函数，他会直接执行函数
Vue.use(VueRouter);

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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
