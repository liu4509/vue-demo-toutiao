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
        <van-icon
          name="search"
          color="white"
          size="18"
          @click="$router.push('/search')"
        />
      </template>
    </van-nav-bar>

    <!-- 频道列表的标签页 -->
    <van-tabs v-model="active" sticky offset-top="1.2267rem">
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <!-- 文章列表组件 -->
        <ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      @closed="popupClose"
    >
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{
                  isDel ? "点击移除频道" : "点击进入频道"
                }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{
                isDel ? "完成" : "编辑"
              }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col
                span="6"
                v-for="(item, index) in userChannel"
                :key="item.id"
              >
                <!-- 用户的频道 Item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="onUserChannelClick(item, index)"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="
                      isDel && item.name !== '推荐' && userChannel.length > 2
                    "
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>

          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>

          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div
                  class="channel-item van-hairline--surround"
                  @click="addChannel(item)"
                >
                  {{ item.name }}
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 用户判断列表数据API
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updateUserChannelAPI,
} from "@/api/homeAPI";
// 文章列表组件
import ArtList from "@/components/ArtList/ArtList.vue";
export default {
  name: "Home",
  data() {
    return {
      // 标签页的激活项的索引
      active: 0,
      userChannel: [],
      show: false,
      // 所有的频道列表数据
      allChannel: [],
      // 频道数据是否处于删除的状态
      isDel: false,
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
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI();
      if (res.message === "OK") {
        // 请求的数据 保存在 allChannel 里面
        this.allChannel = res.data.channels;
      }
    },
    // 新增频道（形参 item 就是当前用户点击的频道信息对象）
    addChannel(item) {
      // 将用户点击的频道，添加到“用户频道”列表中
      this.userChannel.push(item);
      // 调用 updateChannel 方法，把最新的频道列表数据提交到后端保存
      this.updateChannel();
    },
    // 把用户的频道列表数据提交到后端保存
    async updateChannel(item) {
      // 准备要提交到服务器的数据
      const channels = this.userChannel
        .filter((item) => item.name !== "推荐")
        .map((item, index) => {
          return {
            id: item.id,
            seq: index + 1,
          };
        });

      // 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels);
      if (res.message === "更新用户频道成功") {
        // 提示用户更新成功
        this.$notify({ type: "success", message: "更新成功", duration: 1000 });
      }
    },
    // 从用户频道列表中，移除指定 id 的频道
    onUserChannelClick(channel, index) {
      if (this.isDel) {
        // 状态 可以删除
        // 判断点击的是否的推荐按钮
        if (channel.name === "推荐" || this.userChannel.length === 2) return;
        // 从 userChannel 中移除指定的频道
        this.userChannel = this.userChannel.filter(
          (item) => item.id !== channel.id
        );
        // 将更改过后的用户频道数据，提交到服务器保存
        this.updateChannel();
      } else {
        // 状态 不可以删除
        // 1. 修改 Tabs 的激活项的索引值
        this.active = index;
        // 2. 关闭 popup 弹出层
        this.show = false;
      }
    },
    // 关闭弹出层且动画结束后触发
    popupClose() {
      // 重置 频道编辑按钮
      this.isDel = false;
    },
  },
  components: {
    ArtList,
  },
  computed: {
    // 更多频道的数据
    moreChannels() {
      return this.allChannel.filter((item) => {
        // 判断当前循环项 是否在我的频道里面
        const index = this.userChannel.findIndex((x) => x.id === item.id);
        // 如果不在，return true 把这一项存储在新数值之中
        if (index === -1) return true;
      });
    },
  },
  created() {
    // 请求用户的频道列表数据
    this.initUserChannel();

    // 请求所有的频道列表数据
    this.initAllChannel();
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

.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>
