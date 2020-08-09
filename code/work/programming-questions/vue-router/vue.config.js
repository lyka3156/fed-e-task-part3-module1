module.exports = {
    // Vue 的构建版本   默认false 运行时版的vue  true 代表完整版的vue
    // 运行时版：不支持 template 模板，需要打包的时候提前编译
    // 完整版：包含运行时和编译器，体积比运行时版大 10K 左右，程序运行的时候把模板转换成 render 函数
    runtimeCompiler: true
}