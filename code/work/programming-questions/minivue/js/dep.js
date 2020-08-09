
// Dep 的实现

// - 功能
// - 收集依赖，添加观察者(watcher)
//     - 在data的getter方法中收集依赖(添加观察者)  addSub(watcher)
//     - 在data的setter方法中通知依赖(通知观察者/发送信息)    notice()
// - 通知所有观察者

// - 结构
// - subs                 观察者数组
// - addSub(sub)          收集依赖(添加观察者) 
// - notice               发送消息(通知观察者)

class Dep {
    constructor() {
        this.subs = []; // 收集依赖  记录观察者的数组
    }
    // 添加观察者
    addSub(sub) {
        // 是观察者才添加进去
        sub && sub.update && this.subs.push(sub);
    }
    // 向观察者发送消息
    notify() {
        this.subs.forEach(sub => { sub.update() });
    }
}