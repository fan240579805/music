<template>
  <div id="music_list_detail">
    <div class="list_Info" v-if="listInfo.coverImgUrl">
      <div class="coverImg">
        <img v-if="listInfo.coverImgUrl" :src="listInfo.coverImgUrl" alt="" width="200" />
        <!-- <img v-else :src="listInfo.creator.backgroundUrl" alt="" /> -->
      </div>
      <div class="intro">
        <div class="title">
          <div class="list_type"></div>
          <h2 style="font-weight: 600">{{ listInfo.name }}</h2>
        </div>
        <div class="list_creator">
          <div class="avatar">
            <img class="avatar" :src="listInfo.creator.avatarUrl" alt="" />
            <img
              v-if="
                listInfo.creator.avatarDetail !== null || listInfo.creator.avatarDetail
              "
              class="avatar_tag"
              :src="listInfo.creator.avatarDetail.identityIconUrl"
              alt=""
            />
          </div>
          <div class="name">
            <a href="">{{ listInfo.creator.nickname }}</a>
          </div>
          <div class="update_time">更新时间：{{ listInfo.updateTime | formatDate }}</div>
        </div>
        <div class="button_wrap">
          <div class="play" @click="AddAllMusic">
            <a-icon
              type="caret-right"
              style="font-size: 20px; margin-right: 10px"
            />播放全部
          </div>
          <div class="OtherBtn" v-if="!subscribed">
            <a-icon type="file-add" style="font-size: 20px; margin-right: 10px" />收藏({{
              listInfo.subscribedCount
            }})
          </div>
          <div v-if="subscribed" class="OtherBtn">
            <a-icon
              type="file-add"
              style="font-size: 20px; margin-right: 10px"
            />已收藏({{ listInfo.subscribedCount }})
          </div>
          <div class="OtherBtn">
            <a-icon type="share-alt" style="font-size: 20px; margin-right: 10px" />分享({{
              listInfo.shareCount
            }})
          </div>
        </div>
        <div class="tag_wrap" v-if="listInfo.tags.length !== 0">
          标签:
          <a
            class="tags"
            v-for="(tag, index) in listInfo.tags"
            :key="index"
            style="margin-left: 10px"
          >
            {{ tag }}
            <!-- <span v-if="formatName(tag, listInfo.tags)"> &nbsp/&nbsp </span> -->
            &nbsp
          </a>
        </div>
        <div class="total_wrap">
          <div class="songCount">歌曲：{{ listInfo.tracks.length }}</div>
          <div class="playCount">播放：{{ listInfo.playCount }}</div>
        </div>
        <div class="desc_wrap" v-if="listInfo.description">
          <div
            class="Prebtn"
            @click="showPre"
            style="color: grey; float: right"
            v-if="descLength > 1"
          >
            <div v-show="!showFlag">▼</div>
            <div v-show="showFlag">▲</div>
          </div>
          <div class="desc" style="font-size: 14px" v-show="showFlag">
            <pre class="preText" ref="preArea">简介：{{ listInfo.description }}</pre>
          </div>

          <div class="desc" v-show="!showFlag">
            <div class="FirstText" style="display: flex">
              简介：{{ firstDesc }}
              <div
                style="margin-left: 3px"
                v-if="descLength > 1"
                title="点击右方查看完整简介"
              >
                ...
              </div>
            </div>
          </div>
        </div>
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
        :key="Item.id"
        @dblclick.native="dbPlay(Item.id, Item.name, Item.al.picUrl, Item.ar)"
      >
        <div class="index" slot="begin">{{ index + 1 }}</div>
        <div
          class="tool"
          slot="second"
          style="cursor: pointer"
          @click="clicklike(Item.id, Item.like, index)"
        >
          <a-icon v-if="!Item.like" type="heart" style="padding-right: 1vw" />
          <a-icon
            v-if="Item.like"
            :class="{ RED: Item.like }"
            type="heart"
            style="padding-right: 1vw"
            theme="filled"
          />
        </div>

        <div class="name_wrap" slot="third">{{ Item.name }}</div>

        <div class="art" slot="forth">
          <div class="artists_Wrap" v-for="(arItem, index) in Item.ar" :key="index">
            <div
              class="artist_name"
              :title="arItem.name"
              @click="$router.push({ path: 'singer_detail', query: { id: arItem.id } })"
            >
              {{ arItem.name }}
            </div>
            <span v-if="formatName(Item.ar, arItem.name)"> &nbsp/&nbsp </span>
          </div>
        </div>
        <div class="album_wrap" slot="fifth">
          {{ Item.al.name }}
        </div>
        <div class="time_wrap" slot="end">
          <div class="time" v-if="Item.m">{{ calcSongTiem(Item.m.size, Item.m.br) }}</div>
          <div class="time" v-else-if="Item.l">
            {{ calcSongTiem(Item.l.size, Item.l.br) }}
          </div>
          <div class="time" v-else>NaN</div>
        </div>
      </listSlot>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { nameArrayFormatMixin, playAllMusicListMixin } from "@/utils/mixin.js";

import { getMusicListDetail, getDynamicList } from "network/indexReq";
import indexReq from "network/indexReq";
import { like, getlikeList } from "network/songReq";
import { showNum, formatDate } from "@/utils/common.js";

import listSlot from "components/common/listSlot/listSlot";

export default {
  name: "music_list_detail",
  mixins: [nameArrayFormatMixin, playAllMusicListMixin],
  data() {
    return {
      listId: 0, // 该歌单 id
      listInfo: {}, // 该歌单信息
      descLength: 0, // 简介高度
      firstDesc: "", //第一句简介
      showFlag: false,
      subscribed: false, // 是否收藏
      likeSongs: [],
      musicList: [],
    };
  },
  created() {
    this.listId = this.$route.query.id;
    this.getList();
  },

  // 为了让 在同一页面跳转 如歌单->歌单实现数据更新，所以重新请求一下数据
  beforeRouteUpdate(to, from, next) {
    this.listId = to.query.id;
    this.getList();
    next();
  },
  methods: {
    ...mapActions(["AddPlayListAction", "AddAllRankMusicList"]),
    ...mapState(["userProfile"]),
    async getList() {
      let cookie = localStorage.getItem("cookie");
      try {
        const res = await getMusicListDetail({ id: this.listId });

        this.listInfo = res.data.playlist;
        this.musicList = this.listInfo.tracks;
        // 登陆了才能获取
        if (localStorage.getItem("cookie")) {
          // 获取喜欢歌曲列表
          const Dynatic = await getDynamicList({ id: this.listId });
          const likeSongs = await getlikeList({ uid: this.userProfile.userid });
          this.likeSongs = likeSongs.data.ids;
          this.subscribed = Dynatic.data.subscribed;
          // 判断个单列表中是否有喜欢歌曲，有就标记为红心
          this.musicList.map((item) => {
            let flag = this.likeSongs.some((likeSongsItem) => {
              return likeSongsItem == item.id;
            });
            if (flag) {
              return (item.like = true);
            } else {
              return (item.like = false);
            }
          });
          this.musicList = [...this.musicList];
        }

        // 获取第一行简介和简介行数
        if (this.listInfo.description) {
          this.descLength = this.listInfo.description.split(/\n/).length; // 有数据
          this.firstDesc = this.listInfo.description.split(/\n/)[0];
        }
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
      // console.log(this.firstDesc);
    },
    // 喜欢歌曲
    async clicklike(id, likeFlag, index) {
      // 喜欢状态则取消喜欢，不喜欢则变为喜欢
      if (likeFlag) {
        let res = await like({ id, like: false });
      } else {
        let res = await like({ id, like: true });
      }
      let newItem = JSON.parse(JSON.stringify(this.musicList[index]));
      newItem.like = !newItem.like;
      this.musicList.splice(index, 1, newItem);
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
#music_list_detail {
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
      .list_creator {
        display: flex;
        align-items: center;

        .avatar {
          position: relative;
          margin-right: 6px;
          .avatar_tag {
            width: 13px;
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 3px;
          }
          .avatar {
            width: 28px;
            border-radius: 50%;
          }
        }
        .update_time {
          margin-left: 3%;
        }
      }
      .button_wrap {
        display: flex;

        margin: 15px 0;
        .play {
          width: 15%;
          cursor: pointer;
          background-color: red;
          color: #fff;
          padding: 5px 30px;
          border-radius: 17px;
          text-align: center;
          display: flex;
          align-items: center;
          height: 35px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
        .OtherBtn {
          cursor: pointer;
          height: 35px;
          width: 18%;
          margin-left: 20px;
          background-color: #fff;
          color: #333;
          padding: 5px 30px;
          border-radius: 17px;
          border: 1px solid rgb(143, 141, 141);
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
          text-align: center;
        }
      }
      .tag_wrap {
        display: flex;
        .tags {
        }
      }
      .total_wrap {
        display: flex;
        .playCount {
          margin-left: 10%;
        }
        margin: 4px 0;
      }
      .desc_wrap {
        .Prebtn {
          padding-right: 10px;
          cursor: pointer;
        }
        .desc {
          .preText {
            font: 1em sans-serif;
            padding-right: 10px;
            white-space: pre-wrap; /* css3.0 */
            white-space: -moz-pre-wrap; /* Firefox */
            white-space: -pre-wrap; /* Opera 4-6 */
            white-space: -o-pre-wrap; /* Opera 7 */
            word-wrap: break-word; /* Internet Explorer 5.5+ */
          }
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
            cursor: pointer;
            display: inline-block;
          }
          .artist_name:hover {
            color: #000;
          }
        }
      }
      .RED {
        color: red;
      }
      .tool:hover {
        color: #000;
      }

      .album_wrap {
        width: 16vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .name_wrap {
        width: 22vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }
}
</style>
