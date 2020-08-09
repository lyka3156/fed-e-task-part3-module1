# 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
        el: '#el'
        data: {
        o: 'object',
        dog: {}
    },
    method: {
        clickHandler () {
            // 该 name 属性是否是响应式的
            // 不是响应式
            // this.dog.name = 'Trump';

            // 是响应式的
            Vue.set(this.dog,name,"Trump"); // 这种方式添加的就是响应式的。
        }
    }
})
```

1. 不是响应式的数据, 如果是重新设置 dog 对象就是响应式的，他里面的属性不是响应式的。

   - vue 的 data 数据是在 new Vue 的时候调用 new Observer 方法 把 data 的数据变成响应式数据的。
   - 当我们 new Vue 之后添加的属性，此时仅仅只是给 vm 上增加了一个普通的 js 属性，此时的属性不是响应式的。

2. 把新增成员设置成响应式数据
   - 对于已经创建的实例，Vue 不允许动态添加根级别的响应式属性，但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式属性。
   - 它的内部原理就是手动帮我们调用了 defineReactive 方法帮我们把添加的属性转换成 getter 和 setter

# 2. 请简述 Diff 算法的执行过程

在执行 Diff 算法的过程就是调用名为 patch 的函数，比较新旧节点。一边比较一边给真实的 DOM 打补丁。patch 函数接收两个参数 oldVnode 和 Vnode，它们分别代表新的节点和之前的旧节点。这个 patch 函数会比较 oldVnode 和 vnode 是否是相同的, 即函数 sameVnode(oldVnode, vnode), 根据这个函数的返回结果分如下两种情况：
