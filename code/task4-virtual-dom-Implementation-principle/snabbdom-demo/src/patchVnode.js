function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue:
    VNodeQueue) {
    const hook = vnode.data?.hook;
    // 首先执行用户设置的 prepatch 钩子函数
    hook?.prepatch?.(oldVnode, vnode);
    const elm = vnode.elm = oldVnode.elm!;
    let oldCh = oldVnode.children as VNode[];
    let ch = vnode.children as VNode[];
    // 如果新老 vnode 相同返回
    if (oldVnode === vnode) return;
    if (vnode.data !== undefined) {
        // 执行模块的 update 钩子函数
        for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode,
            vnode);
        // 执行用户设置的 update 钩子函数
        vnode.data.hook?.update?.(oldVnode, vnode);
    }
    // 如果 vnode.text 未定义
    if (isUndef(vnode.text)) {
        // 如果新老节点都有 children
        if (isDef(oldCh) && isDef(ch)) {
            // 使用 diff 算法对比子节点，更新子节点
            if (oldCh !== ch) updateChildren(elm, oldCh, ch,
                insertedVnodeQueue);
        } else if (isDef(ch)) {
            // 如果新节点有 children，老节点没有 children
            // 如果老节点有text，清空dom 元素的内容
            if (isDef(oldVnode.text)) api.setTextContent(elm, '');
            // 批量添加子节点
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
            // 如果老节点有children，新节点没有children
            // 批量移除子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
            // 如果老节点有 text，清空 DOM 元素
            api.setTextContent(elm, '');
        }
    } else if (oldVnode.text !== vnode.text) {
        // 如果没有设置 vnode.text
        if (isDef(oldCh)) {
            // 如果老节点有 children，移除
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        // 设置 DOM 元素的 textContent 为 vnode.text
        api.setTextContent(elm, vnode.text!);
    }
    // 最后执行用户设置的 postpatch 钩子函数
    hook?.postpatch?.(oldVnode, vnode);
}