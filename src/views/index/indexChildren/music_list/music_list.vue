<template>
  <div id="music_list">
    <div class="introduction" v-if="musicList[0]">
      <img class="bckc" v-lazy="musicList[0].coverImgUrl" alt="" />
      <!-- 如果我们 vue 组件中 template 里面添加了下标（靠数组索引得到的值），就会报索引为 undefined
　　解决方法：
　　在我们使用下标时，要在父组件上做条件判断，如果这个下标存在，然后就显示里面的内容，这样就不会报 undefined 了， -->
      <div class="intro_avatar" v-if="musicList[0]">
        <img v-lazy="musicList[0].coverImgUrl" alt="" />
      </div>
      <div class="intro_title" v-if="musicList[0]">
        <div class="intro_tag"><div class="intro_tag_item">精品歌单</div></div>
        <h3>{{ musicList[0].name }}</h3>
        <p>{{ musicList[0].copywriter }}</p>
      </div>
    </div>
    <div class="tag">
      <tagsControl :tags="tagList" @tagNameClick="tagNameHappen" />
    </div>
    <div class="long_list">
      <div
        class="list_item"
        v-for="musicListitem in excludeFirstMusicList"
        :key="musicListitem.id"
      >
        <div class="list_item_avatar">
          <div class="playCount">
            <a-icon type="caret-right" />{{ musicListitem.playCount }}
          </div>
          <img
            v-lazy="musicListitem.coverImgUrl"
            alt=""
            @click="goDetail(musicListitem.id)"
          />
          <div class="creator">
            <a href="/FM">{{ musicListitem.creator.nickname }}</a>
          </div>
          <div class="music_play_wrap">
            <img class="PLAY" src="@/assets/images/play1.png" alt="" />
          </div>
        </div>
        <span class="list_item_title">{{ musicListitem.name }}</span>
      </div>
    </div>
    <div class="pageControl">
      <a-pagination :default-current="2" :total="500" />
    </div>
  </div>
</template>

<script>
import indexReq from "network/indexReq";
import { mapGetters } from "vuex";
import tagsControl from "components/common/tagsControl/tagsControl";
export default {
  name: "music_list",
  data() {
    return {
      musicList: [], // 歌单列表
      tagList: [], // tag 列表
      params: {
        // 获取歌单列表的参数
        limit: 61,
        before: 0,
        cat: "华语",
      },
    };
  },

  created() {
    this.getMusicListData();
    this.getMusicTagData();
  },
  computed: {
    ...mapGetters(["getCookie"]),
    // 除去第一个歌单
    excludeFirstMusicList() {
      let newMusic = [...this.musicList];
      newMusic.splice(0, 1);
      return newMusic;
    },
    cookie() {
      return this.getCookie;
    },
  },
  methods: {
    // 获取 歌单 列表数据
    async getMusicListData() {
      console.log(this.getCookie);
      try {
        const res = await indexReq.getMusicList(this.params); // 60条数据
        console.log(res);
        this.musicList = res.data.playlists;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取所有 标签
    async getMusicTagData() {
      try {
        const res = await indexReq.getMusicListTags();
        this.tagList = res.data.tags;
      } catch (error) {
        console.log(error);
      }
    },
    // 接收子组件传来的tag name
    tagNameHappen(name) {
      console.log(1 + name);
      this.params.cat = name;
      this.getMusicListData();
    },
    goDetail(id) {
      this.$router.push({
        path: "/musicList_detail",
        query: {
          id,
        },
      });
    },
  },
  components: {
    tagsControl,
  },
};
</script>

<style scoped>
h3 {
  color: #fff;
}
#music_list {
  padding-top: 60px;
}
.introduction {
  position: relative;
  height: 200px;
  margin-right: 30px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
}
.introduction .bckc {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 100%;
  max-height: 143px;
  filter: blur(20px); /* Chrome, Opera */
}
.intro_avatar {
  position: absolute;
  top: 50%;
  left: 2%;
  transform: translateY(-50%);
}
.intro_avatar img {
  width: 160px;
  height: 160px;
}
.intro_title {
  color: #fff !important;
  position: absolute;
  top: 30%;
  left: 200px;
  margin-left: 10px;
}
.long_list {
  display: flex;
  flex-wrap: wrap;
}
.long_list .list_item {
  width: 19%;

  margin: 0.7vw 0.7vw 0.7vw 0;
  position: relative;
}
.list_item_avatar {
  position: relative;
  height: 14vw;
  width: 14vw;
}
.list_item_avatar:hover .music_play_wrap .PLAY {
  opacity: 1;
}
.list_item_avatar .music_play_wrap {
  position: absolute;
  bottom: 0;
  right: 0;
  widows: 60px;
  height: 60px;
}
.list_item_avatar .music_play_wrap .PLAY {
  width: 60px;
  height: 60px;
  opacity: 0;
}

.list_item_avatar .playCount {
  position: absolute;
  top: 0;
  right: 5%;
  color: #fff;
  z-index: 99;
}
.list_item_avatar .creator {
  position: absolute;
  left: 5%;
  bottom: 5%;
  color: #fff;
}
.creator a {
  color: inherit;
  text-decoration: none;
  display: block;
  border: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}
.list_item_avatar img {
  height: 14vw;
  width: 14vw;
  cursor: pointer;
  border-radius: 1vw;
}
.list_item_title {
  width: 13.5vw;
  padding: 0;
  margin: 0;
  width: 13.5vw;
  display: block;
}
.tag {
  position: relative;
}
</style>
