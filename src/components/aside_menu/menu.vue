<template>
  <div id="menu">
    <div class="menu_wrap">
      <ul>
        <li
          :class="{ li_active: currentIndex1 === index1 }"
          v-for="(item1, index1) in menuList1"
          :key="index1"
          @click="clickLi1(index1, item1.path)"
        >
          {{ item1.name }}
        </li>
      </ul>
      <div class="my_music_tag">我的音乐</div>
      <ul>
        <li
          :class="{ li_active: currentIndex2 === index2 }"
          v-for="(item2, index2) in menuList2"
          :key="index2"
          @click="clickLi2(index2, item2.path)"
        >
          {{ item2.name }}
        </li>
      </ul>
      <div class="music_list_tag">
        <div @click="createFlag = !createFlag" style="cursor: pointer; margin: 5px 0">
          <div class="pull" v-show="createFlag">
            创建的歌单<a-icon type="caret-down" />
          </div>
          <div class="pull" v-show="!createFlag">
            创建的歌单<a-icon type="caret-right" />
          </div>
        </div>
        <div v-show="createFlag">
          <router-link
            class="link"
            v-for="(listItem, index2) in CreateList"
            :key="listItem.id"
            :to="{ path: '/musicList_detail', query: { id: listItem.id } }"
            :title="listItem.name"
          >
            <a-icon type="customer-service" style="padding-right: 5px" />{{
              listItem.name
            }}
          </router-link>
        </div>
      </div>
      <div class="music_list_tag">
        <div @click="collectFlag = !collectFlag" style="cursor: pointer; margin: 5px 0">
          <div class="pull" v-show="collectFlag">
            创建的歌单<a-icon type="caret-down" />
          </div>
          <div class="pull" v-show="!collectFlag">
            创建的歌单<a-icon type="caret-right" />
          </div>
        </div>
        <div v-show="collectFlag">
          <router-link
            class="link"
            v-for="(listItem, index2) in CollectList"
            :key="listItem.id"
            :to="{ path: '/musicList_detail', query: { id: listItem.id } }"
            :title="listItem.name"
          >
            <a-icon type="customer-service" style="padding-right: 5px" />{{
              listItem.name
            }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      menuList1: [
        {
          name: "发现音乐",
          path: "/",
        },
        {
          name: "视频",
          path: "/video",
        },
        // {
        //   name: "朋友",
        //   path: "/friends",
        // },
        // {
        //   name: "直播",
        //   path: "/zhibo",
        // },
        // {
        //   name: "私人FM",
        //   path: "/FM",
        // },
      ],
      menuList2: [
        {
          name: "本地音乐",
          path: "/local_music",
        },

        {
          name: "下载管理",
          path: "/download",
        },
      ],
      currentIndex1: 0,
      currentIndex2: -1,
      CreateList: [], // 创建歌单
      createFlag: false, // 标记是否展开下拉栏
      CollectList: [], // 收藏歌单
      collectFlag: false,
    };
  },
  mounted() {
    this.$bus.$on("test", (musicListObj) => {
      // 总线监听，等登陆之后传过来的歌单信息
      // 根据歌单的userId判断，如果和vuex中的userid相等则说明是自己的歌单
      // 否则则是收藏的歌单
      // userId
      let i = 0;
      for (let index = 0; index < musicListObj.musicList.length; index++) {
        if (musicListObj.musicList[index].userId !== musicListObj.uid) {
          // 找到自己收藏的歌单索引
          i = index;
          break;
        }
      }
      // 将歌单截取成两部分，收藏和创建
      this.CreateList = musicListObj.musicList.splice(0, i);
      this.CollectList = musicListObj.musicList;
    });
  },
  methods: {
    clickLi1(index1, path) {
      this.currentIndex1 = index1;
      this.currentIndex2 = -1;
      this.$router.push(path);
    },
    clickLi2(index2, path) {
      this.currentIndex2 = index2;
      this.currentIndex1 = -1;
      this.$router.push(path);
    },
  },
  // watch 监听变化的路由
  watch: {
    $route() {
      // 获取路径
      let path = this.$route.path;
      // 由于 最后一次点击 返回上一层路径的功能存在 最后一次路由改变时
      // this.$route.path= /index/xxx 该 path 不存在于 menuList1 中，所以有bug
      // 故不能直接判断 menuList1 是否存在，要先处理一下 path 再判断
      let paths = path.split("/"); // 以 / 分割字符串 判断有没有 index
      let hasIndexPage = paths.findIndex((v) => v === "index");
      // 有 index 主页 这个页面
      if (hasIndexPage != -1) {
        this.currentIndex1 = 0;
        this.currentIndex2 = -1;
      } else {
        // 不在index 页面下 /侧边栏菜单样式取消
        this.currentIndex1 = -1;
        this.currentIndex2 = -1;
      }
      // 路径 一致 ，则变红
      let index1 = this.menuList1.findIndex((v) => v.path === path);
      let index2 = this.menuList2.findIndex((v) => v.path === path);

      if (index1 != -1) {
        this.currentIndex1 = index1;
        this.currentIndex2 = -1;
      }
      if (index2 != -1) {
        this.currentIndex2 = index2;
        this.currentIndex1 = -1;
      }
    },
  },
};
</script>

<style scoped>
ul {
  margin: 10px;
  padding: 0;
}
ul li {
  list-style: none;
  margin: 10px;
  padding: 5px;
  color: #000;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
}
.li_active {
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #eee;
  border-radius: 5%;
  background-color: #eee;
}
.my_music_tag,
.music_list_tag {
  padding: 0 20px;
  color: rgb(134, 131, 131);
  font-size: 13px;
}
.link {
  font-size: 16px;
  padding: 10px 0px;
  margin: 5px 0;
  display: block;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
}
.link:hover {
  background-color: #d5d5d5;
}
.pull:hover {
  color: #9e9d9d;
}
</style>
