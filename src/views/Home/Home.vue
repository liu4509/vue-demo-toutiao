<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed placeholder>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="@/assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="1.2267rem">
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">{{
        item.name
      }}</van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
// 用户判断列表数据API
import { getUserChannelAPI } from "@/api/homeAPI";

export default {
  name: "Home",
  data() {
    return {
      // 标签页的激活项的索引
      active: 0,
      userChannel: [],
    };
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI();
      // 获取是否成功
      if (res.message === "OK") {
        this.userChannel = res.data.channels;
      }
    },
  },
  created() {
    this.initUserChannel();
  },
};
</script>

<style lang="less" scoped>
// 组件外层样式

// logo
.logo {
  height: 80%;
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>
