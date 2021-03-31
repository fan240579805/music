<template>
  <div id="album_detail">
    <div class="list_Info" v-if="listInfo.blurPicUrl">
      <div class="coverImg">
        <img v-if="listInfo.blurPicUrl" :src="listInfo.blurPicUrl" alt="" width="200" />
        <!-- <img v-else :src="listInfo.creator.backgroundUrl" alt="" /> -->
      </div>
      <div class="intro">
        <div class="title">
          <div class="list_type"></div>
          <h2 style="font-weight: 600">{{ listInfo.name }}</h2>
        </div>
        <div class="button_wrap">
          <div class="play" @click="AddAllMusic">
            <a-icon
              type="caret-right"
              style="font-size: 20px; margin-right: 10px"
            />播放全部
          </div>
          <div class="OtherBtn">
            <a-icon type="file-add" style="font-size: 20px; margin-right: 10px" />收藏({{
              listInfo.info.likedCount
            }})
          </div>
          <div class="OtherBtn">
            <a-icon type="share-alt" style="font-size: 20px; margin-right: 10px" />分享({{
              listInfo.info.shareCount
            }})
          </div>
        </div>
        <div class="tag_wrap">
          歌手:
          <router-link
            class="tags"
            v-for="(tag, index) in musicList[0].ar"
            :key="index"
            style="margin-left: 10px"
            :to="{ path: '/singer_detail', query: { id: tag.id } }"
          >
            {{ tag.name }}
            <!-- <span v-if="formatName(tag, listInfo.tags)"> &nbsp/&nbsp </span> -->
            &nbsp
          </router-link>
        </div>
        <div class="time">时间：{{ listInfo.publishTime | formatDate }}</div>
      </div>
    </div>
    <div class="list_wrap">
      <listSlot style="margin-bottom: 10px">
        <div slot="title_third">音乐标题</div>
        <div slot="title_forth">歌手</div>
        <div slot="title_fifth">专辑</div>
        <div slot="title_end">时长</div>
      </listSlot>

      <listSlot
        class="listSlot_wrap"
        v-for="(Item, index) in musicList"
        :key="Item.name"
        @dblclick.native="dbPlay(Item.id, Item.name, Item.al.picUrl, Item.ar)"
      >
        <div class="index" slot="begin">{{ index + 1 }}</div>
        <div class="tool" slot="second">
          <a-icon type="heart" style="padding-right: 1vw" />
        </div>
        <div class="name_wrap" slot="third">{{ Item.name }}</div>

        <div class="art" slot="forth">
          <div class="artists_Wrap" v-for="(arItem, index) in Item.ar" :key="index">
            <router-link
              :to="{ path: '/singer_detail', query: { id: arItem.id } }"
              class="artist_name"
              :title="arItem.name"
            >
              {{ arItem.name }}
            </router-link>
            <span v-if="formatName(Item.ar, arItem.name)"> &nbsp/&nbsp </span>
          </div>
        </div>
        <div class="album_wrap" slot="fifth">
          {{ Item.al.name }}
        </div>
        <div class="time_wrap" slot="end">
          <div class="time" v-if="Item.m">{{ calcSongTiem(Item.m.size, Item.m.br) }}</div>
          <div class="time" v-else>{{ calcSongTiem(Item.l.size, Item.l.br) }}</div>
        </div>
      </listSlot>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { nameArrayFormatMixin, playAllMusicListMixin } from "@/utils/mixin.js";

import { getAlbumDetail } from "network/singerReq";
import indexReq from "network/indexReq";
import { showNum, formatDate } from "@/utils/common.js";

import listSlot from "components/common/listSlot/listSlot";

export default {
  name: "album_detail",
  mixins: [nameArrayFormatMixin, playAllMusicListMixin],
  data() {
    return {
      listId: 0, // 该歌单 id
      listInfo: {}, // 该歌单信息
    };
  },
  created() {
    this.listId = this.$route.query.id;
    this.getList();
  },

  methods: {
    ...mapActions(["AddPlayListAction", "AddAllRankMusicList"]),
    async getList() {
      try {
        const res = await getAlbumDetail({ id: this.listId });
        this.listInfo = res.data.album;
        this.musicList = res.data.songs;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取歌曲url
    async getMusic(id) {
      try {
        const res = await indexReq.getMusicUrl({ id });
        return res.data.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    // 双击播放音乐
    async dbPlay(id, title, image_url, artists) {
      let musicInfo = await this.getMusic(id);

      let musicItem = {
        id,
        musicInfo,
        image_url,
        title,
        artists,
      };
      this.AddPlayListAction(musicItem);
    },
    showPre() {
      this.showFlag = !this.showFlag;
    },
  },
  computed: {
    // 计算歌曲时间
    calcSongTiem() {
      return (size, br) => {
        let s = showNum(((size * 8) / br) % 60);
        let m = showNum(((size * 8) / br / 60) % 60);
        return m + ":" + s;
      };
    },
    getDescLength() {
      this.showFlag = this.descLength <= 1;
      return this.descLength <= 1;
    },
  },
  filters: {
    formatDate,
  },
  components: {
    listSlot,
  },
};
</script>

<style lang="less" scoped>
#album_detail {
  .list_Info {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    .coverImg {
      img {
        border-radius: 10px;
      }
    }
    .intro {
      width: calc(100vw - 400px);
      margin-left: 3%;
      .button_wrap {
        display: flex;

        margin: 15px 0;
        .play {
          cursor: pointer;
          background-color: red;
          color: #fff;
          padding: 5px 30px;
          border-radius: 15px;
          text-align: center;
          display: flex;
          align-items: center;
        }
        .OtherBtn {
          cursor: pointer;
          margin-left: 20px;
          background-color: #fff;
          color: #333;
          padding: 5px 30px;
          border-radius: 15px;
          border: 1px solid rgb(143, 141, 141);
        }
      }
      .tag_wrap {
        display: flex;
        .tags {
        }
      }
    }
  }
  .list_wrap {
    .listSlot_wrap:nth-child(even) {
      background-color: #f7f7f7;
    }
    .listSlot_wrap {
      .art {
        display: flex;
        align-items: center;
        display: inline-block; // 加上这个就可以了
        width: 16vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        padding: 5px;
        .artists_Wrap {
          display: inline-block;

          .artist_name {
            color: grey;
            cursor: pointer;
            display: inline-block;
          }
          .artist_name:hover {
            color: #000;
          }
        }
      }
      .album_wrap {
        width: 16vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }
}
</style>
