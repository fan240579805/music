<template>
  <div id="app">
    <loginForm v-show="showLogin" />
    <navbar @click.native="$refs.play.showPlayList = false" />
    <a-layout>
      <a-layout class="main_container" :style="{ backgroundColor: '#fff' }">
        <a-layout-sider
          :style="{ backgroundColor: '#fff', borderRight: ' 1px solid #eee' }"
          style="
             {
              overflow: hidden;
              overflow-y: scroll;
            }
          "
          @click="$refs.play.showPlayList = false"
          ><apicker />
        </a-layout-sider>
        <a-layout-content
          class="MainContent"
          @click="$refs.play.showPlayList = false"
          :style="{ backgroundColor: '#fff', marginLeft: '30px' }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer :style="{ padding: 0 }"><play ref="play" /></a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import navbar from "components/navbar/navbar";
import play from "components/play/play";
import apicker from "components/aside_menu/menu";
import loginForm from "components/login/loginForm";
export default {
  name: "App",
  components: {
    navbar,
    play,
    apicker,
    loginForm,
  },
  computed: {
    ...mapGetters(["getFlag"]),
    showLogin() {
      return this.getFlag;
    },
  },
  methods: {},
};
</script>

<style>
/*@import "./assets/css/base.css";
/** 滚动条样式 */

#app {
  overflow: hidden;
  min-width: 980px;
}
.main_container {
  height: calc(100vh - 60px - 75px);
}
</style>
