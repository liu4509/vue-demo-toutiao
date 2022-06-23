<template>
  <div>
    <!-- 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="18"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length != 0">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="item"
        @click="gotoSearchResult"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(tag, index) in history"
          :key="index"
          @click="gotoSearchResult"
          >{{ tag }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
// 搜索建议 API
import { getSuggestListAPI } from "@/api/searchAPI.js";

export default {
  name: "Search",
  data() {
    return {
      // 搜索关键词
      kw: "",
      // 延时器的 Id
      timerId: null,
      // 搜索建议列表
      suggestList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem("history") || "[]"),
    };
  },
  methods: {
    // 输入框防抖
    onInput() {
      // 在 500 毫秒内 清除上一次的延时器
      clearTimeout(this.timerId);
      // 如果输入内容空  不客气延时器
      if (this.kw.length === 0) {
        this.suggestList = [];
        return;
      }
      // 开启延时器 将延时器的 id 存储到 this.timerId
      this.timerId = setTimeout(() => {
        // 调用搜索建议 API 方法
        this.initSuggestList();
      }, 500);
    },
    // 请求搜索建议数据列表
    async initSuggestList() {
      const { data: res } = await getSuggestListAPI(this.kw);
      if (res.message === "OK") {
        // 调用 hlightKeywords 方法，对关键词进行高亮处理
        this.hlightKeywords(res.data.options);
        // 将高亮的结果，赋值给 suggestList
        this.suggestList = res.data.options;
        // 把关键词加入搜索历史里
        const newHistory = this.history.filter((item) => item !== this.kw);
        newHistory.unshift(this.kw);
        this.history = newHistory;
      }
    },
    // 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
    hlightKeywords(arr) {
      // 根据用户输入的 kw，动态创建正则表达式
      const reg = new RegExp(this.kw, "ig");
      arr.forEach((item, index) => {
        // 返回没有数据 就不执行后面的关键字高亮处理
        if (item === null) return;
        // 调用字符串的 replace 方法进行关键字的高亮处理
        arr[index] = item.replace(reg, (val) => {
          return `<span style="color: red; font-weight: bold;">${val}</span>`;
        });
      });
    },
    // 跳转到搜索结构项
    gotoSearchResult(e) {
      // e.currentTarget 是当正在触发事件的那个元素
      // 获取用户点击的搜索建议项
      const kw = e.currentTarget.innerText;
      // 通过编程式导航API 跳转到搜索结果项
      // 动态路由
      this.$router.push("/search/" + kw);
    },
  },
  // 监听器
  watch: {
    // 监视历史记录的变化
    history(newVal) {
      localStorage.setItem("history", JSON.stringify(newVal));
    },
  },
  // DOM 结构 已经渲染在浏览器上了 可以操作 DOM
  mounted() {
    const ipt = document.querySelector("input[type=search]");
    ipt && ipt.focus();
  },
};
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 00 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    //文本不会换行
    white-space: nowrap;
    overflow: hidden;
    // 显示省略符号 ... 来代表被修剪的文本
    text-overflow: ellipsis;
  }
}
.search-icon {
  font-size: 16px;
  // 从父元素继承 line-height 属性的值
  line-height: inherit;
}
.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>