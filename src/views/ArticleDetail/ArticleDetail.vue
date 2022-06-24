<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      placeholder
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="article">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="article.aut_name"
        :label="article.pubdate | dateFormat"
      >
        <template #icon>
          <!-- 头像 -->
          <img :src="article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button
              type="info"
              size="mini"
              v-if="article.is_followed"
              @click="setUnfollow"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="setFollow"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="article.attitude === 1"
          @click="setDislike"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="setLike"
          >点赞</van-button
        >
      </div>
    </div>

    <!-- 文章评论区域 -->
    <ArtCmt v-if="article" :artId="id"></ArtCmt>
  </div>
</template>

<script>
// 获取文章详情 API
import {
  getArticleDetailAPI,
  followUserAPI,
  unfollowUserAPI,
  addLikeAPI,
  delLikeAPI,
} from "@/api/articleAPI.js";

// 评论组件
import ArtCmt from "@/components/ArtCmt/ArtCmt.vue";
export default {
  name: "ArticleDetail",
  // id 文章ID
  props: ["id"],
  data() {
    return {
      // 文章的信息对象 不要赋值为 null 后面添加数据会报错
      // 使用 v-if="article" 防止 DOM 里面的值找不到出现报错
      article: null,
    };
  },
  methods: {
    // 初始化文章数据
    async initArticle() {
      const { data: res } = await getArticleDetailAPI(this.id);
      if (res.message === "OK") {
        this.article = res.data;
      }
    },
    //  关注作者
    async setFollow() {
      const { data: res } = await followUserAPI(this.autId);
      if (res.message === "OK") {
        // 提示用户成功
        this.$toast.success("关注成功！");
        // 手动更改关注的状态
        this.article.is_followed = true;
      }
    },
    // 取消关注
    async setUnfollow() {
      const res = await unfollowUserAPI(this.autId);
      // 判断响应码
      if (res.status === 204) {
        // 2.1 提示用户
        this.$toast.success("取关成功！");
        // 2.2 手动更改关注的状态
        this.article.is_followed = false;
      }
    },
    // 文章点赞
    async setLike() {
      const { data: res } = await addLikeAPI(this.id);
      if (res.message === "OK") {
        // 提示用户
        this.$toast.success("点赞成功！");
        // 手动变更点赞的状态
        this.article.attitude = 1;
      }
    },
    // 文章取消点赞
    async setDislike() {
      const res = await delLikeAPI(this.id);
      if (res.status === 204) {
        // 提示用户
        this.$toast.success("取消点赞成功！");
        // 手动变更点赞的状态
        this.article.attitude = -1;
      }
    },
  },
  computed: {
    // 作者 ID
    autId() {
      return this.article.aut_id.toString();
    },
  },
  components: {
    // 评论组件
    ArtCmt,
  },
  created() {
    this.initArticle();
  },
};
</script>

<style lang="less" scoped>
.article-container {
  padding: 10px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}
.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  // 剪切左右超出的内容 裁剪内容 - 提供滚动机制。
  overflow-x: scroll;
  // 允许在单词内换行。
  word-break: break-all;
}
.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}
.like-box {
  display: flex;
  justify-content: center;
}
</style>
