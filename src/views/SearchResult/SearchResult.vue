<template>
  <div class="search-result-container">
    <!-- 点击后退效果 -->
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    />
    <!-- 上拉加载更多 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 循环渲染文章的列表 -->
      <ArtItem
        v-for="item in searchList"
        :key="item.art_id"
        :article="item"
        :closable="false"
      ></ArtItem>
    </van-list>
  </div>
</template>

<script>
// 封装搜索文章数据的 API
import { getSearchResultAPI } from "@/api/searchAPI.js";
// 文章列表 组件
import ArtItem from "@/components/ArtItem/ArtItem.vue";
export default {
  name: "SearchResult",
  props: ["kw"],
  data() {
    return {
      // 页码
      page: 1,
      // 搜索的结果
      searchList: [],
      // 是否正在进行上拉加载的数据请求
      loading: false,
      // 所有数据是否已经加载完毕
      finished: false,
    };
  },
  methods: {
    // 搜索结果 API
    async initSearchList() {
      // 节流阀 防止发送多次相同的 请求接口
      this.loading = true;
      const { data: res } = await getSearchResultAPI(this.kw, this.page);
      if (res.message === "OK") {
        this.searchList = [...this.searchList, ...res.data.results];
        this.loading = false;
        // 判断数据是否没有了
        if (res.data.results.length === 0) {
          this.finished = true;
        }
        // 让页码值 +1
        this.page += 1;
      }
      // 关闭节流阀 防止发送多次相同的 请求接口
      this.loading = false;
    },
    onLoad() {
      this.initSearchList();
    },
    // 组件自定义 方法
    removeArticle(artId) {
      console.log(artId);
    },
  },
  components: {
    ArtItem,
  },
  // 初始化 porps data methods 成功后启动
  created() {
    this.initSearchList();
  },
};
</script>

<style lang="less" scoped>
</style>