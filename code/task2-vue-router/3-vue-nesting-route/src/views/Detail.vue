<template>
  <div class="detail">
    <h1>This is an Detail page</h1>

    <!-- 方法1：通过当前路由规则，获取数据 -->
    方法1 通过当前路由规则获取: {{$route.params.id}}
    <br />
    <!-- 方法2： 路由规则中开启 props 传参 -->
    方法2 通过开启 props 获取: {{$route.params.id}}
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["id"] // 从路由规则的props中拿到的
};
</script>
