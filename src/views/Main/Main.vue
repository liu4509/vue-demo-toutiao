<template>
  <div>
    <!-- Home and User 组件的路占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 底部的 TabBar -->
    <van-tabbar route fixed placeholder>
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
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