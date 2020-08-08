// 发布订阅模式

// 事件触发器
class EventEmitter {
  constructor() {
    // 存取事件名和事件名对应的事件
    this.subs = Object.create(null);
  }

  // 订阅事件
  $on(eventName, handle) {
    // this.subs[eventName] = [...(this.subs[eventName] || []), handle];
    (this.subs[eventName] || (this.subs[eventName] = [])).push(handle);
  }

  // 触发事件
  $emit(eventName) {
    this.subs[eventName] && this.subs[eventName].forEach((fn) => fn());
  }
}

let event = new EventEmitter();

event.$on("click", () => {
  console.log("click1");
});
event.$on("click", () => {
  console.log("click2");
});

event.$emit("click");
