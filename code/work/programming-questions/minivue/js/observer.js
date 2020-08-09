// Observer 的实现
// observer 监听 data 中所有属性的变化

// - 功能
//     - 负责把 data 选项中的属性转换成响应式数据
//     - data 中的某个属性也是对象，把该属性转换成响应式数据
//     - 数据变化发送通知       结合Dep观察者实现

// - 结构
//     - Observer 类
//     - walk(data)                 观察对象
//     - defineReactive(data,prop,value)    定义响应式成员

class Observer {
    constructor(data) {
        this.walk(data);
    }

    // 1. 负责把 data 选项中的属性转换成响应式数据
    walk(data) {
        // 不是对象直接返回
        if (!data || typeof data !== "object") return;

        // 遍历 data 的所有成员
        Reflect.ownKeys(data).forEach(prop => {
            // 定义响应式成员
            this.defineReactive(data, prop, data[prop]);
        })
    }

    // 定义响应式成员
    defineReactive(data, prop, value) {
        const self = this;
        // 3. 创建Dep 对象，负责收集依赖，并发送通知
        let dep = new Dep();

        // 2. data 中的属性也是对象，把该对象也转换成响应式数据
        self.walk(value);
        Reflect.defineProperty(data, prop, {
            enumerable: true,   // 可枚举
            configurable: true, // 可配置   (能delete 和 重新 defineProperty)
            // 访问成员时触发
            get() {
                // 3.1 添加依赖
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            // 设置成员时触发
            set(newValue) {
                if (newValue === value) return; // 值没有变化不做任何逻辑
                // 新赋值的newValue是对象，把该对象也转换成响应式数据
                self.walk(newValue);
                value = newValue;

                // 3.2 发送通知   Dep
                dep.notify();
            }
        })
    }
}