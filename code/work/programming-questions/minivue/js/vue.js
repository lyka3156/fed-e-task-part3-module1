// vue 的实现

// - 功能
//     - 通过属性保存初始化的参数(选项)
//     - 把 data 中的属性注入到 Vue 实例，转换成 getter/setter
//     - 调用 observer 监听 data 中所有属性的变化
//     - 调用 compiler 解析指令/插值表达式

// - 结构
//     - Vue 类
//     - $options  属性
//     - $el   属性
//     - $data 属性
//     - _proxyData 方法

// Vue 类
class Vue {
  constructor(options) {
    // 1. 通过属性保存初始化的参数(选项)
    // 保存options选项
    this.$options = options || {};
    // 保存el元素
    const el = options.el;
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    // 保存options的data对象
    this.$data = options.data || {};

    // 2. 把 data 中的属性注入到 Vue 实例，转换成 getter/setter
    this._proxyData(this.$data);

    // 3. 调用 observer 监听 data 中所有属性的变化
    new Observer(this.$data);

    // 4. 调用 compiler 解析指令/插值表达式
    new Compiler(this);
  }
  // 代理数据
  _proxyData(data) {
    // 遍历data的所有属性
    Reflect.ownKeys(data).forEach((prop) => {
      // 将 data 中的属性注入到 Vue 实例上，并转换成 getter/setter
      Reflect.defineProperty(this, prop, {
        get() {
          return data[prop];
        },
        set(newValue) {
          if (newValue === data[prop]) return;
          data[prop] = newValue;
        },
      });
    });
  }
}
