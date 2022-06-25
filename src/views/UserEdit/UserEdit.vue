<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="$refs.fileRef.click()"
          />
          <!-- 文件选择框 -->
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            v-show="false"
            ref="fileRef"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="onNameCellClick"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthCellClick"
      />
    </van-cell-group>

    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改名称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <!-- input-align 文本横向的对其方式 -->
      <van-field
        v-model.trim="name"
        placeholder="请输入用户名"
        input-align="center"
        maxlength="7"
        ref="nameRef"
      />
    </van-dialog>

    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="updateBirthday"
    /></van-action-sheet>
  </div>
</template>

<script>
// vuex 里面的简介信息方法
import { mapActions, mapState } from "vuex";
// 修改用户信息 API
import { updateUserProfileAPI, updateUserAvatarAPI } from "@/api/userAPI.js";
// 导入 dayjs
import dayjs from "dayjs";

export default {
  name: "UserEdit",
  data() {
    return {
      // 是否展示修改姓名的对话框
      showNameDialog: false,
      // 用户填写的姓名
      name: "",
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date(),
    };
  },
  methods: {
    //  获取简介信息
    ...mapActions(["initUserProfile"]),
    // 点击修改名称的 cell
    onNameCellClick() {
      this.name = this.userProfile.name;
      this.showNameDialog = true;
      this.$nextTick(() => {
        this.$refs.nameRef.focus();
      });
    },
    // 用户名称面板 关闭前的回调函数
    beforeClose(actios, done) {
      // 点击了取消
      if (actios === "cancel") return done();

      // 判断名称的长度是否合法
      if (this.name === "" || this.name.length > 7) {
        // 1. 提示用户“名称的长度为1-7个字符”
        this.$notify({
          type: "warning",
          message: "名称的长度应为1-7个字符",
          duration: 2000,
        });
        this.$refs.nameRef.focus();
        return done(false);
      }
      // 发起修改名称的请求
      // 请求成功 关闭对话框
      // 请求失败 提示用户失败信息， 阻止对话框关闭
      this.updateName(done);
    },
    // 更新用户名称
    async updateName(done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name });
        if (res.message === "OK") {
          done();
          // 重新请求用户的简介信息
          this.initUserProfile();
          // 提示用户更新成功
          this.$notify({
            type: "success",
            message: "名称更新成功",
            duration: 2000,
          });
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 提示用户名被占用
          this.$notify({
            type: "warning",
            message: "名称被占用， 请更换后重试！",
            duration: 2000,
          });
          // 阻止关闭对话框
          done(false);
          // 文本获取焦点
          this.$refs.nameRef.focus();
        } else {
          done();
          // 提示用户名被占用
          this.$notify({
            type: "warning",
            message: "名称更新失败！",
            duration: 2000,
          });
        }
      }
    },
    // 用户生日面板
    onBirthCellClick() {
      // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
      this.currentDate = this.userProfile.birthday
        ? new Date(this.userProfile.birthday)
        : new Date();
      // 弹出动作面板
      this.showBirthSheet = true;
    },
    // 更新用户生日
    async updateBirthday(value) {
      // 关闭动作面板
      this.showBirthSheet = false;
      // 调用 .format() 方法对时间进行格式化
      const dateStr = dayjs(value).format("YYYY-MM-DD");

      const { data: res } = await updateUserProfileAPI({ birthday: dateStr });
      if (res.message === "OK") {
        // 重新获取用户的简介信息
        this.initUserProfile();
        // 提示用户更新成功
        this.$notify({
          type: "success",
          message: "生日修改成功",
          duration: 2000,
        });
      }
    },
    // 用户图片修改
    async onFileChange(e) {
      // 获取到用户选择的文件列表
      const files = e.currentTarget.files;
      // 如果没有选择任何文件，则不执行后续的业务逻辑
      if (files.length === 0) return;

      const fd = new FormData();
      fd.append("photo", files[0]);

      // 调用 API 更新头像
      const { data: res } = await updateUserAvatarAPI(fd);
      if (res.message === "OK") {
        this.initUserProfile();
        this.$notify({
          type: "success",
          message: "更新头像成功",
          duration: 2000,
        });
      }
    },
  },
  computed: {
    // 从 vuex 中把指定名称的 State 数据映射到组件中使用
    ...mapState(["userProfile"]),
  },
  created() {
    this.initUserProfile();
  },
};
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
}
</style>