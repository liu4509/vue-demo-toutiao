<template>
  <!-- App 根组件 -->
  <div>
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less" scoped></style>
