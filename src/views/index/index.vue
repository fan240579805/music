<template>
  <div id="index">
    <tabControl :titles="titleList" @tabTitleItem="itemclick" ref="tabc" />
    <div class="index_child_Wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import tabControl from "components/common/tabControl/tabControl";
export default {
  name: "index",
  data() {
    return {
      path: "",
      titleList: [
        { name: "个性推荐", path: "/commend" },
        { name: "歌单", path: "/music_list" },
        { name: "排行榜", path: "/rank" },
        { name: "歌手", path: "/singer" },
        { name: "最新音乐", path: "/latest" },
      ],
    };
  },
  created() {},
  methods: {
    itemclick(path) {
      this.path = path;
    },
  },
  // watch 监听变化的路由
  watch: {
    $route() {
      // 获取路径
      let path = this.$route.path;
      // 路径 一致 ，则变红
      let index = this.titleList.findIndex((v) => "/index" + v.path === path);

      if (index != -1) {
        this.$refs.tabc.currentIndex = index;
      }
    },
  },
  // 路由 被 激活时 获取sessionStorage 有则加载 sessionStorage的路由 无则 第一页路由

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      let routepath = sessionStorage.getItem("routePath");
      // 第一次进来
      if (routepath == null) {
        vm.path = "/commend";
        sessionStorage.setItem("routePath", vm.path);

        vm.$refs.tabc.currentIndex = 0;
      } else {
        vm.path = sessionStorage.getItem("routePath");
        if (vm.path === "/index/commend") {
          return;
        }
        vm.$router.push("/index" + vm.path);

        let index = vm.titleList.findIndex((v) => v.path === vm.path);
        vm.$refs.tabc.currentIndex = index;
      }
    });
  },

  // 路由 离开 不活跃时 将当前点击的路由存入 sessionStorage 中
  beforeRouteLeave(to, from, next) {
    // ...
    sessionStorage.setItem("routePath", this.path);
    next();
  },
  // deactivated() {
  //   sessionStorage.setItem("routePath", this.path);
  // },
  components: {
    tabControl,
  },
};
</script>

<style scoped>
.index_child_Wrap {
  margin-left: 13px;
}
</style>
