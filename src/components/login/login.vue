<template>
  <div id="login" @mouseenter="hoverHandle">
    <div class="user" @click="userClick">
      <div class="avatar" v-if="!LoginStatus">
        <img src="@/assets/images/默认头像.png" alt="" />
      </div>

      <div class="avatar" v-if="LoginStatus"><img :src="profile.avatarUrl" alt="" /></div>
      <div class="username" v-if="!LoginStatus">未登录</div>
      <div class="username" v-if="LoginStatus">{{ profile.nickname }}</div>
      <div class="extend"><a-icon type="caret-down" /></div>
    </div>
    <transition name="fade" mode="out-in">
      <!--  :class="{ HoverList: listFlag }" -->
      <div
        class="userInfoList"
        v-show="LoginStatus && listFlag"
        @mouseleave="leaveHandle"
        key="box1"
      >
        <div class="fans">
          <div class="item">
            <span class="count">1</span><span class="fansItem">动态</span>
          </div>
          <div class="item">
            <span class="count">1</span><span class="fansItem">关注</span>
          </div>
          <div class="item">
            <span class="count">1</span><span class="fansItem">粉丝</span>
          </div>
        </div>
        <div class="logout" @click="Logout">退出登录</div>
      </div>
    </transition>
    <!-- <loginForm /> -->
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { logout } from "network/post/login";

export default {
  name: "login",
  data() {
    return {
      loginFlag: false,
      listFlag: false,
    };
  },
  methods: {
    ...mapMutations(["changeFlag", "clearStatus"]),
    userClick() {
      // 没登陆的情况下才能点出登录窗口
      if (!this.LoginStatus) {
        this.changeFlag();
      }
    },
    hoverHandle() {
      this.listFlag = true;
    },
    leaveHandle() {
      this.listFlag = false;
    },
    // 退出登录
    Logout() {
      logout();
      this.clearStatus();
      localStorage.clear();
      this.$message.warning("已退出登录");
    },
  },
  computed: {
    ...mapGetters(["getLoginStatus", "getProfile"]),
    LoginStatus() {
      return this.getLoginStatus;
    },
    profile() {
      return this.getProfile;
    },
  },
};
</script>

<style lang="less">
#login:hover .HoverList {
  transform: scale(1.1);
}
#login {
  width: 150px;
  position: relative;
  .user {
    font-size: 13px;
    cursor: pointer;
    display: flex;
    color: rgb(133, 130, 130);
    align-items: center;
    .username {
      padding: 0 5px;
    }
    .avatar {
      img {
        width: 30px;
        border-radius: 15px;
      }
    }
  }

  .userInfoList {
    background-color: #fff;
    width: 250px;
    height: 200px;
    position: absolute;
    top: 170%;
    right: -20%;
    border-radius: 5px;
    border: 1px solid #eee;
    z-index: 9999;
    box-shadow: 0px 0px 10px -5px;
    transition: 0.5s;

    .logout:hover {
      background-color: #f6f6f6;
    }
    .logout {
      cursor: pointer;
      text-align: center;
      padding: 10px;
    }
    .fans {
      display: flex;
      align-items: center;
      justify-content: center;
      .item {
        flex: 1;
        padding: 10px;
        margin: 0 10px;
        .count {
          display: block;
          text-align: center;
          font-weight: 600;
          font-size: 20px;
        }
        .fansItem {
          display: block;
          color: #d5d5d5;
          font-size: 13px;
          text-align: center;
        }
      }
      border-bottom: 1px solid #eeee;
    }
  }
  .user:hover {
    color: #fff;
  }
}
</style>
