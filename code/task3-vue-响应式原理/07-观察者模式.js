// 观察者模式

// 发布者
class Dep {
  constructor() {
    this.subs = []; // 记录所有的订阅者
  }

  // 添加订阅者
  addSub(sub) {
    // sub是观察者才添加
    sub && sub.update && this.subs.push(sub);
  }
  // 发布通知
  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}

// 订阅者-观察者
class Watcher {
  update() {
    console.log("观察者: " + Math.random().toFixed(2));
  }
}

// 创建发布者
let dep = new Dep();

// 创建观察者
let watcher1 = new Watcher();
let watcher2 = new Watcher();

// 添加观察者
dep.addSub(watcher1);
dep.addSub(watcher2);

// 发布通知
dep.notify();
