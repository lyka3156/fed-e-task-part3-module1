# 1. 模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

```js
// vue-router.js
// 在vue-router的history模块实现中改以下几个地方就可以了

// 获取当前 hash 串
getHash() {
    return window.location.hash.slice(1) || "/";
}

// 设置当前路径
onHashChange() {
    this.data.current = this.getHash(); // 重新设置当前路由路劲
}

// 1. init 方法中
// 在此方法中初始化路由映射表对象、事件、组件
init() {
    // 页面加载的时候就改变hash地址，并触发hashChange方法
    // 这样的话页面刷新的话，当前地址的hash值还存在
    window.addEventListener("load", () => {
        this.data.current = this.getHash(); // 重新设置当前路由路劲
        window.location.hash = this.getHash(); // 改变hash地址
    });
}

// 2. 创建 router-link 组件中a标签的单击事件中改变hash来切换浏览器中的地址，并把当前地址记录到浏览器的访问历史中，会触发hashchange方法
handleClick(e) {
    e.preventDefault(); // 禁用掉 a 标签的默认事件，a标签的默认事件会向服务器发送请求
    window.location.hash = this.to; // 通过 location.url 来切换浏览器中的地址，并把当前地址记录到浏览器的访问历史中，会触发hashchange方法
},

// 3. 在调用浏览器的前进和后退时执行，或者hashchange改变时执行
window.addEventListener("hashchange", this.onHashChange.bind(this));
```

# 2. 在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

```js
// 1. v-html的实现
htmlUpdate(node, value, prop) {
    console.log(node, value, prop);
    // 首次渲染v-html中的值
    node.innerHTML = value;
    // 当数据变化后重新渲染视图
    // 处理v-html指令的时候创建watcher对象
    let watcher = new Watcher(this.vm, prop, (newValue) => {
        node.innerHTML = newValue;
    });
}

// 2. v-on的实现
onUpdate(node, value, prop, eventName) {
    // 绑定事件
    node.addEventListener(eventName, () => {
        this.vm.$options.methods[prop] && this.vm.$options.methods[prop]();
    });
}

 /**
 * 负责编译元素的指令
 * @param {*} node 节点对象
 * @param {*} attrName 指令的名称
 * @param {*} prop 指令对应的属性名
 */
// update方法需要修改下
update(node, attrName, prop) {
    let [newAttrName, eventName] = attrName.split(":"); // 获取属性名和:后面的事件名
    let updateFn = this[newAttrName + "Update"]; // 获取编译指令的方法
    updateFn && updateFn.call(this, node, this.vm[prop], prop, eventName);
}
```

# 3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果，如图：
