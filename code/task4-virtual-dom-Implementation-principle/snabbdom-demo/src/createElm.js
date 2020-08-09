function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {

    let i: any, data = vnode.data;
    if (data !== undefined) {
        // 执行用户设置的 init 钩子函数
        const init = data.hook?.init;
        if (isDef(init)) {
            init(vnode);
            data = vnode.data;
        }
    }
    let children = vnode.children, sel = vnode.sel;
    if (sel === '!') {
        // 如果选择器是!，创建评论节点
        if (isUndef(vnode.text)) {
            vnode.text = '';
        }
        vnode.elm = api.createComment(vnode.text!);
    } else if (sel !== undefined) {
        // 如果选择器不为空
        // 解析选择器
        // Parse selector
        const hashIdx = sel.indexOf('#');
        const dotIdx = sel.indexOf('.', hashIdx);
        const hash = hashIdx > 0 ? hashIdx : sel.length;
        const dot = dotIdx > 0 ? dotIdx : sel.length;
        const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0,
            Math.min(hash, dot)) : sel;
        const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
            ? api.createElementNS(i, tag)
            : api.createElement(tag);
        if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
        if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot +
            1).replace(/\./g, ' '));
        // 执行模块的 create 钩子函数
        for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode,
            vnode);
        // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                const ch = children[i];
                if (ch != null) {
                    api.appendChild(elm, createElm(ch as VNode,
                        insertedVnodeQueue));
                }
            }
        } else if (is.primitive(vnode.text)) {
            // 如果 vnode 的 text 值是 string/number，创建文本节点并追加到 DOM 树
            api.appendChild(elm, api.createTextNode(vnode.text));
        }
        const hook = vnode.data!.hook;
        if (isDef(hook)) {
            // 执行用户传入的钩子 create
            hook.create?.(emptyNode, vnode);
            if (hook.insert) {
                // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
                insertedVnodeQueue.push(vnode);
            }
        }
    } else {
        // 如果选择器为空，创建文本节点
        vnode.elm = api.createTextNode(vnode.text!);
    }
    // 返回新创建的 DOM
    return vnode.elm;
}