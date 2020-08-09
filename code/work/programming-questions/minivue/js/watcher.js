// watcher 的实现

// - 功能
//     - 当数据变化触发依赖， dep 通知所有的 Watcher 实例更新视图
//     - 自身实例化的时候往 dep 对象中添加自己
// - 结构
//     - vm                  vm实例
//     - prop                 data中的属性名
//     - cb                  回调函数，如何更新视图，通过vm和prop拿到数据，并更新视图
//     - oldValue            变化之前的值
//     - update()            更新的方法
//          - 拿到oldValue和vm[prop]去做比较，如果数据发生了变化就通过cb去更新视图，没有发生变化就不做任何操作

class Watcher {
    constructor(vm, prop, cb) {
        this.vm = vm;           // vue 实例
        this.prop = prop;         // data中的属性名
        this.cb = cb;           // 回调函数，负责更新视图


        // 2. 自身实例化的时候往 dep 对象中添加自己
        // 2.1 把watcher对象记录到Dep类的静态属性target
        Dep.target = this;
        // 2.2 触发$data的get方法，在get方法中会调用addSub方法添加watcher
        this.oldValue = vm[prop];    // 变化之前的值
        // 2.3 防止watcher重复添加
        Dep.target = null;
    }
    // 数据发生变化更新视图
    update() {
        let newValue = this.vm[this.prop];       // 拿到最新的值
        if (this.oldValue === newValue) return;  // 旧值和新值一样就不做任何操作
        this.cb(newValue);      // 将最新的值交给cb函数去更新视图
    }
}
