<template>
  <div>
    <!-- Home and User 组件的路占位符 -->
    <router-view></router-view>
    <!-- 底部的 TabBar -->
    <van-tabbar route fixed safe-area-inset-bottom>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style lang="less" scoped>
</style>