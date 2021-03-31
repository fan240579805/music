<template>
  <div id="loginForm">
    <div class="login_wrap">
      <div class="cansel"><a-icon type="close" @click="close" /></div>
      <div class="bckc"><img src="@/assets/images/手机登录背景.png" alt="" /></div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入你的手机号!' }] },
            ]"
            placeholder="Username"
          >
            <a-icon slot="prefix" type="mobile" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入你的密码!' }] },
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            记住我
          </a-checkbox>
          <a class="login-form-forgot" href="" style="color: #d5d5d5"> 找回密码 </a>
          <a-button type="danger" html-type="submit" class="login-form-button">
            登录
          </a-button>
          <a href="" style="color: #333"> 注册 </a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

import { getUsersMusicList } from "network/hasLoginedApi/getUser";
import { phoneLogin } from "network/post/login";

import { hex_md5 } from "utils/md5.js";
export default {
  name: "loginForm",
  data() {
    return {
      loginFlag: false,
      phone: "",
      password: "",
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    ...mapMutations(["changeFlag", "setProfile", "changeLoginStatus", "setCookie"]),
    // 登录事件
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // values 为表单中接收到的值 手机号 和密码等等
          //console.log("Received values of form: ", values);
          this.phone = values.userName;
          // md5加密密码
          this.password = hex_md5(values.password);
        }
      });
      this.pLogin();
    },
    // 手机登录
    async pLogin() {
      try {
        const res = await phoneLogin({ phone: this.phone, md5_password: this.password });
        if (res.data.code === 400) {
          // 手机号错误或密码错误 // 弹窗提示登陆失败
        } else if (res.data.code === 200) {
          // 登陆成功
          let userInfo = res.data.profile;
          let cookie = res.data.cookie;
          let token = res.data.token;
          // 设置个人中心信息
          this.setProfile(userInfo);
          // 设置cookie
          this.setCookie(cookie);
          localStorage.setItem("cookie", cookie);
          // 改变登陆状态
          this.changeLoginStatus();
          // 关闭登录窗口
          this.changeFlag();
          // 弹窗提示登陆成功 请求一下自己收藏和创建的歌单
          const UserMusicList = await getUsersMusicList({ uid: userInfo.userId });
          let musicListObj = {
            uid: userInfo.userId,
            musicList: UserMusicList.data.playlist,
          };
          this.$bus.$emit("test", musicListObj);
          this.$message.success("登陆成功");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 关闭窗口
    close() {
      this.changeFlag();
    },
  },
};
</script>

<style lang="less">
#loginForm {
  position: relative;
  .bckc {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 70%;
    }
  }
  .login_wrap {
    border: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0px 0px 10px -5px;
    background-color: #fff;
    width: 400px;
    height: 500px;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, 14%);
    z-index: 9999;
    .cansel {
      font-size: 20px;
      display: flex;
      justify-content: end;
      flex-direction: row-reverse;
      margin: 10px;
      color: #d5d5d5;
    }
    .cansel:hover {
      color: #333;
    }
    #components-form-demo-normal-login {
      width: 300px;
      margin: 0 auto;
      .login-form-forgot {
        float: right;
      }
      .login-form-button {
        width: 100%;
      }
      .ant-input:focus {
        border-color: #d9d9d9;
        box-shadow: none;
      }
      .ant-input:hover {
        border-color: #d9d9d9;
      }
      .has-error .ant-input-affix-wrapper .ant-input:hover {
        background-color: #fff;
        border-color: #f5222d;
      }
    }
  }
}
</style>
