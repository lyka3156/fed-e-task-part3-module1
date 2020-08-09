export interface VNode {
    // 选择器
    sel: string | undefined;
    // 节点数据：属性/样式/事件等
    data: VNodeData | undefined;
    // 子节点，和 text 只能互斥
    children: Array<VNode | string> | undefined;
    // 记录 vnode 对应的真实 DOM
    elm: Node | undefined;
    // 节点中的内容，和 children 只能互斥
    text: string | undefined;
    // 优化用
    key: Key | undefined;

}
export function vnode(sel: string | undefined,
    data: any | undefined,
    children: Array<VNode | string> | undefined,
    text: string | undefined,
    elm: Element | Text | undefined): VNode {
    let key = data === undefined ? undefined : data.key;
    return { sel, data, children, text, elm, key };
}
export default vnode;
