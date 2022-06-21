<template>
  <!-- 元素添加名为 login-container 的类名，防止 <van-nav-bar> 组件遮挡其它元素 -->
  <div class="login-container">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <!-- 组件添加 fixed 属性，实现顶部固定定位的效果 -->
    <van-nav-bar title="黑马头条 - 登录" fixed placeholder />
    <!-- 登录表单 -->
    <van-form @submit="login">
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
      ></van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 登录 API 接口
import { loginAPI } from "@/api/userAPI";

// 导入 vuex 的值
import { mapMutations } from "vuex";

export default {
  // 每一个组件的指定唯一的 name 名称
  name: "Login",
  data() {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: "13888888123",
        // 登录密码
        code: "246810",
      },
      // 表单的校验规则对象
      rules: {
        // 手机号的校验规则
        mobile: [
          // 只有同时满足以下两个验证规则，才能验证通过
          {
            // 必填项的校验规则
            required: true,
            message: "请填写您的手机号",
            trigger: "onBlur",
          },
          // 11 位手机号的校验规则
          {
            pattern: /^1\d{10}$/,
            message: "请填写正确的手机号",
            trigger: "onBlur",
          },
        ],
        // 密码的校验规则
        code: [
          { required: true, message: "请填写您的密码", trigger: "onBlur" },
        ],
      },
    };
  },
  methods: {
    // 映射 mutations 中的方法
    ...mapMutations(["updateTokenInfo"]),
    // 只有当表单数据校验通过之后，才会调用此 login 函数
    async login() {
      // 使用 axios 登录
      const { data: res } = await loginAPI(this.form);
      // 判断是否登录成功
      if (res.message === "OK") {
        // 把登录成功的结果，存储到 vuex 中
        this.updateTokenInfo(res.data);
        // 登录成功后，跳转到主页
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>