// 1. Vue.use 是用来注册插件，
// 传入的是对象，他会调用传入对象的 install 方法
// 传入的是函数，他会直接执行函数
// 1. 通过上述知道VueRouter有一个静态方法install

// 2. 实例化VueRouter对象需要传递一个options对象
// 对象里面有mode,base,router是路由规则数组

let _Vue = null;

// 1. VueRouter 是一个构造函数
class VueRouter {
  constructor(options) {
    this.options = options;
  }

  // 1.VueRouter有一个静态方法install
  // 通过install安装VueRouter
  install(Vue) {
    // 判断当前插件是否安装过，安装过直接返回不安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true; // 标识安装过次插件

    // 把Vue的构造函数存到全局
    _Vue = Vue;

    // 提供一个$router方法给Vue的原型上
  }
}

export default VueRouter;
