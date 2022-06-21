<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :disabled="finished"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 循环渲染文章的列表 -->
        <ArtItem
          v-for="item in artList"
          :key="item.art_id"
          :article="item"
        ></ArtItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 文章Item 组件
import ArtItem from "@/components/ArtItem/ArtItem.vue";

// 根据频道ID 请求频道下的文章列表数据API
import { getArtListAPI } from "@/api/homeAPI";

export default {
  name: "ArtList",
  props: {
    // 频道 ID
    channelId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 文章列表的数据
      artList: [],
      // 时间戳
      timestamp: Date.now(),
      // loading 表示是否正在进行上拉加载的请求
      //    每当触发 List 组件的上拉加载更多时，List 组件会自动把 loading 设为 true
      //    每当下一页的数据请求回来以后，需要程序员手动的把 loading 设为 false，
      //    否则：再次触发上拉加载更多时，不会发起请求！！
      loading: false,
      // finished 表示所有数据是否加载完毕
      //    false 表示还有下一页的数据
      //    true  表示所有数据都已加载完毕
      finished: false,
      // 是否能下拉刷新的请求
      isLoading: false,
    };
  },
  methods: {
    async initArtList(isRefresh) {
      // 节流阀 防止发送多次相同的 请求接口
      this.loading = true;
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp);
      if (res.message === "OK") {
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp;
        // 判断是否的下拉
        if (isRefresh) {
          // 下拉刷新
          // 新数据在前;
          this.artList = [...res.data.results, ...this.artList];
          // 重置 isloading 为 false
          this.isLoading = false;
        } else {
          // 上拉加载
          // 拼接 数组 旧数据 在前， 新数据 在后
          this.artList = [...this.artList, ...res.data.results];
          // 重置 loading 为 false
          this.loading = false;
        }
        //判断所有数据 加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true;
        }
      }
    },
    onLoad() {
      this.initArtList();
    },
    onRefresh() {
      this.initArtList(true);
    },
  },
  components: {
    ArtItem,
  },
  created() {
    this.initArtList();
  },
};
</script>

<style lang="less" scoped>
</style>