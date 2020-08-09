// compiler 的实现      操作dom

// - 功能
//      - 编译模板，解析指令/插值表达式
//      - 页面的首次渲染
//      - 当数据变化后重新渲染视图
// - 结构
//      - Compiler 类
//      - el
//      - vm
//      - compile(el)               编译
//          - 负责编译插值表达式
//      - compileElement(node)      编译元素节点
//          - 负责编译元素的指令
//          - 处理 v-text 的首次渲染
//          - 处理 v-model 的首次渲染
//      - compileText(node)         编译本本节点
//      - isDirective(attrName)     是否是v-指令
//      - isTextNode(node)          是否是本文节点
//      - isElementNode(node)       是否是元素节点

class Compiler {
  constructor(vm) {
    this.vm = vm; // 保存vue实例
    this.el = vm.$el; // 保存el元素
    this.compile(this.el);
  }
  // 1. 编译模板，解析指令/插值表达式
  // 编译模板 处理文本节点和元素节点
  compile(el) {
    const nodes = el.childNodes; // 获取子节点对象
    // 遍历el的所有子节点   Array.from 将类数组转换成数组
    Array.from(nodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }
      // 如果当前节点中还有子节点，递归编译
      if (node.childNodes && node.childNodes.length) this.compile(node);
    });
  }

  // 1.1 编译文本节点 处理插值表达式
  compileText(node) {
    // console.dir(node);      //  console.dir将输出的变量以对象的形式打印出来  #text对象
    // 1.) 使用正则表达式实现下面的功能
    // 1. 匹配插值表达式    {{ msg }}        插值表达式
    // 2. 将插值表达式中的内容提取出来       也就是 msg
    let reg = /\{\{(.+?)\}\}/;

    // 2.) 获取文本节点的插值表达式并替换成对应的值
    // 1. 获取文本节点的内容
    let value = node.textContent;
    // 2. 将插值表达式替换成对应的值
    if (reg.test(value)) {
      //  插值表达式中的值就是我们要的属性名称
      let prop = RegExp.$1.trim(); // 获取第一个分组()的内容
      // 把插值表达式替换成具体的值   首次渲染插值表达式中的值
      node.textContent = value.replace(reg, this.vm[prop]);

      // 3. 当数据变化后重新渲染视图
      // 3.1) 处理插值表达式的时候创建watcher对象
      let watcher = new Watcher(this.vm, prop, (newValue) => {
        node.textContent = newValue;
      });
    }
  }

  // 1.2 编译元素节点 处理指令
  compileElement(node) {
    // console.log(node.attributes);
    // 获取所有属性节点
    let attrs = node.attributes;
    // 遍历所有的属性节点
    Array.from(attrs).forEach((attr) => {
      let attrName = attr.name; // 获取属性名
      // 判断是否是指令
      if (this.isDirective(attrName)) {
        // 处理指令
        // v-text --> text
        attrName = attrName.slice(2); // 获取指令的名称
        let prop = attr.value; // 获取指令的值 (vm中的属性名)

        // 使用update这种方式比if的好处  (策略模式)
        // 就是以后要加其他的指令，不需要改动原有代码的逻辑，只需要添加新的方法就行了。
        this.update(node, attrName, prop);
      }
    });
  }
  /**
   * 1.2.1 负责编译元素的指令
   * @param {*} node 节点对象
   * @param {*} attrName 指令的名称
   * @param {*} prop 指令对应的属性名
   */
  update(node, attrName, prop) {
    let [newAttrName, eventName] = attrName.split(":"); // 获取属性名和:后面的事件名
    let updateFn = this[newAttrName + "Update"]; // 获取编译指令的方法
    updateFn && updateFn.call(this, node, this.vm[prop], prop, eventName);
  }

  // 1.2.2  处理 v-text 指令
  textUpdate(node, value, prop) {
    // 首次渲染v-text中的值
    node.textContent = value;
    // 3. 当数据变化后重新渲染视图
    // 3.2) 处理v-text指令的时候创建watcher对象
    let watcher = new Watcher(this.vm, prop, (newValue) => {
      node.textContent = newValue;
    });
  }
  // 1.2.3 处理 v-model 指令       (用在表单元素上的)
  modelUpdate(node, value, prop) {
    // 首次渲染v-model中的值
    node.value = value;
    // 3. 当数据变化后重新渲染视图
    // 3.3) 处理v-model的时候创建watcher对象
    let watcher = new Watcher(this.vm, prop, (newValue) => {
      node.value = newValue;
    });
    // 实现双向绑定
    node.addEventListener("input", () => {
      // 会触发响应式机制，当数据发生变化的时候，又会重新更新我们的试图，所以试图变化插值表达式的值也会发生变化
      this.vm[prop] = node.value;
    });
  }

  // 1.2.4 处理 v-html 指令
  htmlUpdate(node, value, prop) {
    // 首次渲染v-html中的值
    node.innerHTML = value;
    // 3. 当数据变化后重新渲染视图
    // 4.4) 处理v-html指令的时候创建watcher对象
    let watcher = new Watcher(this.vm, prop, (newValue) => {
      node.innerHTML = newValue;
    });
  }

  // 1.2.5 处理 v-on 指令
  onUpdate(node, value, prop, eventName) {
    // 绑定事件
    node.addEventListener(eventName, () => {
      this.vm.$options.methods[prop] && this.vm.$options.methods[prop]();
    });
  }

  // 判断是否是以 v- 开头的指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  // 判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断是否是属性节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
