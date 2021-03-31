<template>
  <div id="navbar">
    <div class="nav_wrap">
      <a-row>
        <a-col :span="4" :style="{ height: '100%' }">
          <div class="logo" style="font-size: 20px; font-weight: 400">
            <svg
              t="1616917399369"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5429"
              width="30"
              height="30"
            >
              <path
                d="M742.3 100.3l-25.6 44.3c126.2 73 204.7 208.9 204.7 354.6 0 225.7-183.6 409.3-409.3 409.3S102.8 724.8 102.8 499.1c0-145.7 78.4-281.5 204.7-354.6l-25.6-44.3c-142 82.1-230.2 235-230.2 398.8 0 253.9 206.6 460.5 460.5 460.5S972.6 753 972.6 499.1c0-163.9-88.2-316.7-230.3-398.8z"
                fill="#e6e6e6"
                p-id="5430"
              ></path>
              <path
                d="M464.2 437l-25.6-44.3c-45.3 26.2-73.5 75-73.5 127.3 0 81 65.9 147 147 147s147-65.9 147-147v-6.3L451.2 115.4h164V64.2H366.8l241 461.8c-3.1 50.1-44.8 89.9-95.6 89.9-52.8 0-95.8-43-95.8-95.8-0.1-34.1 18.2-66 47.8-83.1z"
                fill="#e6e6e6"
                p-id="5431"
              ></path>
            </svg>
            <h3 style="padding-left: 10px; color: #fff">云乐享</h3>
          </div></a-col
        >
        <a-col :span="4" :offset="2" :style="{ height: '100%' }">
          <div class="navbar_tool">
            <div class="back_or_forword">
              <div @click="back"><span style="cursor: pointer"><</span></div>
              <div @click="toforwrad"><span style="cursor: pointer">></span></div>
            </div>
            <div class="sl">
              <searchList />
            </div>
          </div>
        </a-col>
        <a-col class="user_col" :span="6" :offset="8" :style="{ height: '100%' }">
          <div class="tailer">
            <div class="userInfo">
              <login />
            </div>
            <div class="icon_tool">
              <a-icon type="setting" :style="{ fontSize: '22px', margin: '0 10px' }" />
              <a-icon type="skin" :style="{ fontSize: '22px', margin: '0 10px' }" />
              <a-icon type="message" :style="{ fontSize: '22px', margin: '0 10px' }" />
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import searchList from "components/search_todoList/searchList";
import login from "components/login/login";
export default {
  name: "navbar",
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    toforwrad() {
      this.$router.go(1);
    },
  },
  components: {
    searchList,
    login,
  },
};
</script>

<style scoped>
#navbar {
  height: 60px;
  background-color: #000;
}

.nav_wrap {
  width: 100%;
}
.logo {
  display: flex;
  height: 60px;
  padding-left: 20px;
  align-items: center;
}
h3 {
  padding: 0;
  margin: 0;
  line-height: 60px;
  height: 60px;
}
.logo img {
  height: 100%;
  width: 80%;
}
.menu_wrap {
  height: 100%;
}
.menu_wrap .item {
  height: 100%;
}
.ant-menu-horizontal {
  line-height: 64px;
}
.navbar_tool {
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: center;
}
.sl {
  margin-left: 10px;
}
.navbar_tool .back_or_forword {
  flex: 1;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbar_tool .back_or_forword div span {
  height: 100%;
  line-height: 11px;
  text-align: center;
  padding: 0 1px;
}
.navbar_tool .back_or_forword div {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 2px solid #fff;
  box-sizing: border-box;

  border-radius: 50%;
  font-size: 14px;
  width: 18px;
  height: 18px;
  margin: 5px;
}

.tailer {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tailer .icon_tool {
  width: 60%;
  color: #fff;
}
</style>
