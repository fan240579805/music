<template>
  <div id="commend">
    <a-carousel> </a-carousel>
    <a-carousel class="swiper" autoplay effect="fade" arrows>
      <div
        slot="prevArrow"
        class="custom-slick-arrow"
        style="margin-left: 50px; z-index: 999"
      >
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div class="swiper_item" v-for="item in CommendBanners" :key="item.bannerId">
        <a :href="item.url"><img :src="item.pic" alt="" /></a>
      </div>
    </a-carousel>
    <div class="sub_title" @click="musicListTitleTap">
      <span>推荐歌单 ></span>
    </div>
    <div class="commend_musicList">
      <div class="musicListItem" v-for="item in commend_music_list" :key="item.id">
        <div class="playCount">
          <a-icon type="caret-right" />
          {{ item.playcount ? item.playcount : item.playCount }}
        </div>
        <div class="img_wrap" @click="musicListItemTap(item.id)">
          <img v-lazy="item.picUrl" alt="" />
          <div class="play_wrap">
            <img class="play_hidden" src="@/assets/images/play1.png" alt="" />
          </div>
        </div>
        <span class="son_title">{{ item.name }}</span>
      </div>
    </div>
    <div class="sub_title">
      <span>最新音乐 ></span>
    </div>
    <div class="new_music">
      <div
        class="new_music_item_row"
        v-for="(item, index) in new_music_list"
        :key="item.id"
      >
        <div class="music_avatar">
          <div class="music_play_wrap" @click="playMusic(item.id, index)">
            <img src="@/assets/images/play1.png" alt="" />
          </div>
          <img :src="item.picUrl" alt="" />
        </div>
        <div class="title_wrap">
          <div>
            <div class="new_music_title">
              {{ item.name }}
            </div>
            <div class="artist_Wrap">
              <div
                class="artist"
                v-for="(artist, index) in item.song.artists"
                :key="index"
                @click="artistClick"
              >
                <router-link
                  class="artist_name"
                  :title="artist.name"
                  :to="{ path: '/singer_detail', query: { id: artist.id } }"
                  >{{ artist.name }}</router-link
                >
                <span v-if="formatName(item.song.artists, artist.name)"> &nbsp/ </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import indexReq from "network/indexReq";
import { nameArrayFormatMixin } from "@/utils/mixin.js";

export default {
  name: "commend",
  mixins: [nameArrayFormatMixin],
  data() {
    return {
      CommendBanners: [], // 个人推荐模块的轮播图
      commend_music_list: [],
      new_music_list: [],
      musicItem: {},
    };
  },
  filters: {
    playCountFormat(playcount) {
      return;
    },
  },
  created() {
    this.getIndexData();
  },
  methods: {
    ...mapActions(["AddPlayListAction"]),
    // 点击跳转歌单页面
    musicListItemTap(id) {
      this.$router.push({
        path: "/musicList_detail",
        query: {
          id,
        },
      });
    },
    musicListTitleTap() {
      this.$router.push("/index/music_list");
    },
    // 点击跳转 歌手详情页
    artistClick() {},
    // 请求首页数据
    async getIndexData() {
      try {
        const res = await indexReq.getIndex();
        let musicList = null;
        if (localStorage.getItem("cookie")) {
          // 登陆获取这个接口
          musicList = await indexReq.getRecommendList();
          // 删去最后一个推荐歌单 留10个
          musicList.data.recommend.splice(10);
        } else {
          musicList = await indexReq.getNonLoginRec();
        }
        const newMusic = await indexReq.getRecMusic();
        // 轮播图
        this.CommendBanners = res.data.data.blocks[0].extInfo.banners;
        this.commend_music_list = localStorage.getItem("cookie")
          ? musicList.data.recommend
          : musicList.data.result;
        // 推荐音乐
        this.new_music_list = newMusic.data.result;
      } catch (error) {
        console.log(error);
      }
    },
    // 请求 对应的歌曲url
    async getMusicUrlData(id, index) {
      try {
        const res = await indexReq.getMusicUrl({ id });
        await this.makeMusicItem(res.data.data[0], index);
      } catch (error) {
        console.log(error);
      }
    },
    // 构造 musicItem 异步函数
    async makeMusicItem(musicInfo, i) {
      this.musicItem = {
        id: this.new_music_list[i].id,
        musicInfo,
        image_url: this.new_music_list[i].picUrl,
        title: this.new_music_list[i].song.name,
        artists: this.new_music_list[i].song.artists,
      };
    },
    // 点击播放歌曲 ， 存在异步请求 需要async
    async playMusic(id, index) {
      let music_id = id;
      await this.getMusicUrlData(music_id, index);
      this.AddPlayListAction(this.musicItem); // 操作 vuex 实现对播放列表状态的控制
    },
  },
};
</script>

<style scoped>
/* For demo */
#commend {
  margin: 0 20px;
  padding-top: 49px;
}
.swiper {
  width: 55vw !important;
  margin: 0 auto;
}
.son_title {
  margin-top: 0.1vw;
}
.sub_title {
  cursor: pointer;
  margin: 1vh 0 1vh 0;
  font-size: 20px;
  font-weight: 600;
  color: #000;
}
.swiper_item img {
  width: 55vw;
}
.commend_musicList {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}
.commend_musicList .musicListItem {
  /* flex: 1; */
  width: 18%;
  padding: 0;
  margin-right: 20px;
  margin-top: 10px;
  position: relative;
}
.commend_musicList .musicListItem .playCount {
  position: absolute;
  top: 0;
  right: 10%;
  color: #fff;
  z-index: 99;
}
.commend_musicList .musicListItem .son_title {
  width: 13.5vw;
  display: block;
}
.img_wrap {
  position: relative;
  cursor: pointer;

  width: 13.5vw;
  height: 13.5vw;
}
.img_wrap .play_wrap {
  width: 60px;
  height: 60px;
  position: absolute;
  right: 0;
  bottom: 0;
}
.img_wrap .play_wrap .play_hidden {
  width: 60px;
  height: 60px;
}
.img_wrap:hover .play_wrap {
  width: 60px;
  height: 60px;
  position: absolute;
  opacity: 1;
  right: 0;
  bottom: 0;
}
.img_wrap:hover .play_wrap img {
  width: 60px;
  height: 60px;
  opacity: 1;
  right: 0;
  bottom: 0;
}
.play_wrap img {
  opacity: 0;
  right: 0;
  bottom: 0;
}
.commend_musicList .musicListItem img {
  width: 13.5vw;
  height: 13.5vw;
  box-sizing: border-box;

  border-radius: 0.3vw;
}

/* new music */
.music_avatar {
  width: 45px;
  height: 45px;
  position: relative;
  cursor: pointer;
  border: 1px solid #eee;
  border-radius: 8px;
  box-sizing: border-box;
}
.music_avatar .music_play_wrap {
  position: absolute;
}
.new_music {
  display: flex;
  flex-wrap: wrap;
}
.new_music_item_row {
  width: 33%;
  display: flex;
  margin-bottom: 15px;
  padding-right: 10px;
}
.new_music_item_row .title_wrap {
  margin-left: 6px;
  width: calc(100% - 45px);
  height: 45px;
}
.new_music_item_row .title_wrap :hover {
  background-color: #eee;
}
.new_music_item_row .new_music_title {
  width: 100%;

  margin-bottom: 2px;
}
.new_music_title {
  width: calc(100% - 45px);

  /* 内容过长显示成省略号（内容显示为一行） */
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis; /*设置隐藏部分为省略号*/
}
.artist_Wrap {
  display: flex;
  font-size: 12px;
  color: rgba(87, 85, 85, 0.4);
}
.artist {
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
}
.artist .artist_name {
  color: inherit;
  text-decoration: none;
  border: none;
  -webkit-tap-highlight-color: #333;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}
.music_avatar img {
  width: 45px;
  height: 45px;
  border-radius: 8px;
}
/* For demo */

.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel >>> .custom-slick-arrow::before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.8;
}
.ant-carousel >>> .custom-slick-arrow {
  opacity: 0.5;
}
.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}
</style>
