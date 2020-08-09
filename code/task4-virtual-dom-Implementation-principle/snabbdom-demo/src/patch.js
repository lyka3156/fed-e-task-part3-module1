return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    let i: number, elm: Node, parent: Node;
    // 保存新插入节点的队列，为了触发钩子函数
    const insertedVnodeQueue: VNodeQueue = [];
    // 执行模块的 pre 钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
    // 如果 oldVnode 不是 VNode，创建 VNode 并设置 elm
    if (!isVnode(oldVnode)) {
        // 把 DOM 元素转换成空的 VNode
        oldVnode = emptyNodeAt(oldVnode);
    }
    // 如果新旧节点是相同节点(key 和 sel 相同)
    if (sameVnode(oldVnode, vnode)) {
        // 找节点的差异并更新 DOM
        patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
        // 如果新旧节点不同，vnode 创建对应的 DOM
        // 获取当前的 DOM 元素
        elm = oldVnode.elm!;
        parent = api.parentNode(elm);
        // 触发 init/create 钩子函数,创建 DOM
        createElm(vnode, insertedVnodeQueue);
        if (parent !== null) {
            // 如果父节点不为空，把 vnode 对应的 DOM 插入到文档中
            api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
            // 移除老节点
            removeVnodes(parent, [oldVnode], 0, 0);
        }
    }
    // 执行用户设置的 insert 钩子函数
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i]);
    }
    // 执行模块的 post 钩子函数
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    // 返回 vnode
    return vnode;
};