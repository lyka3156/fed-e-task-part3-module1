<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="push">跳转路由</button>
  </div>
</template>
<script>
export default {
  name: "About",
  methods: {
    push() {
      // 1. 跳转路由的两种方式
      // 1.1 根据路由规则的path跳转(字符串)  this.$router.push("/");
      // 1.2 根据路由规则的name跳转(对象)
      // this.$router.push({
      //   name: "home"
      // });

      // 2. replace方法不会把当前路由的路劲记录到历史
      // this.$router.replace("/");

      // 3. 路由传参
      this.$router.push({
        name: "detail",
        params: { id: 2 }
      });
    }
  }
};
</script>
