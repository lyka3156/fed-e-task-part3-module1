<template>
  <div id="app">
    <div id="nav">
      <!-- 6.创建链接:  路由规则中定义的path -->
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
    </div>
    <!-- 5.创建路由组件的占位: 路由规则path对应的component显示的地方 -->
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
