import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // 导入路由对象

Vue.config.productionTip = false;

const vm = new Vue({
  // 4. 注册路由对象
  router,
  render: (h) => h(App),
}).$mount("#app");

// 注册了router对象的vue实例中带有$route和$router两个属性
console.log(vm);
