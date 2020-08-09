// 钩子函数数组
const hooks: (keyof Module)[] = ['create', 'update', 'remove',
    'destroy', 'pre', 'post'];
export function init(modules: Array<Partial<Module>>, domApi?: DOMAPI) {
    let i: number, j: number, cbs = ({} as ModuleHooks);
    // 初始化 api       默认是 htmlDomApi 操作 dom 的 api
    const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;
    // 循环把传入的所有模块的钩子方法，统一存储到 cbs 对象中
    // 最终构建的 cbs 对象的形式 cbs = [ create: [fn1, fn2], update: [], ...]
    for (i = 0; i < hooks.length; ++i) {
        // cbs['create'] = []
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            // const hook = modules[0]['create']
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                (cbs[hooks[i]] as Array<any>).push(hook);
            }
        }
    }
    ……
    ……
    ……
    return function patch(oldVnode: VNode | Element, vnode: VNode): VNode { }
};
