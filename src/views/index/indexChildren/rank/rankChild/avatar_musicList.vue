<template>
  <div id="avatar_rank">
    <div class="title">
      <h2>{{ rankInfo.name }}</h2>
    </div>
    <div class="content">
      <div class="avatar">
        <img
          class="cover"
          v-lazy="rankInfo.coverImgUrl"
          alt=""
          @click="jumpMusicListDetail(rankInfo.id)"
        />
        <div class="play_wrap" @click="AddAllMusic">
          <img class="play_hidden" src="@/assets/images/play1.png" alt="" />
        </div>
      </div>
      <div class="list_wrap" v-if="topFiveMusics">
        <!-- listSlot 为列表每一行的插槽，想往插槽的哪个位置加入什么 就加入什么 ，如：在行首插作者or换个页面在行首插歌名 -->

        <listSlot
          class="listSlot_wrap"
          v-for="(topFiveMusicsItem, index) in topFiveMusics"
          :key="topFiveMusicsItem.name"
          @dblclick.native="
            dbPlay(
              topFiveMusicsItem.id,
              topFiveMusicsItem.name,
              topFiveMusicsItem.al.picUrl,
              topFiveMusicsItem.ar
            )
          "
        >
          <div class="index" slot="begin">{{ index + 1 }}</div>
          <div class="tool" slot="second">
            {{ topFiveMusicsItem.ratio | ratioFilters }}
          </div>

          <div class="name_wrap" slot="third">{{ topFiveMusicsItem.name }}</div>

          <div class="art" slot="end">
            <div
              class="artists_Wrap"
              v-for="(arItem, index) in topFiveMusicsItem.ar"
              :key="index"
            >
              <router-link
                :to="{ path: '/singer_detail', query: { id: arItem.id } }"
                class="artist_name"
                :title="arItem.name"
              >
                {{ arItem.name }}
              </router-link>
              <span v-if="formatName(topFiveMusicsItem.ar, arItem.name)">
                &nbsp/&nbsp
              </span>
            </div>
          </div>
        </listSlot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import listSlot from "components/common/listSlot/listSlot";

import { getRankMusicList } from "network/rankReq";
import { nameArrayFormatMixin, playAllMusicListMixin } from "@/utils/mixin.js";
import indexReq from "network/indexReq";

export default {
  name: "avatar_rank",
  mixins: [nameArrayFormatMixin, playAllMusicListMixin], // 混入
  data() {
    return {
      topFiveMusics: [], // 榜单中 前五首歌
    };
  },
  created() {
    this.getFiveListItem();
  },
  props: {
    // 收到的关于排行榜单的必要信息
    rankInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  filters: {
    ratioFilters(ratio) {
      if (ratio) {
        return ratio + "%";
      } else {
        return "--";
      }
    },
  },
  methods: {
    ...mapActions(["AddPlayListAction", "AddAllRankMusicList"]),
    // 获取榜单 前五项歌曲
    async getFiveListItem() {
      let id = this.rankInfo.id; // 根据id 获取
      try {
        const res = await getRankMusicList({ id });
        // 三元式 判断是否 请求的数据中是songs数组还是playlist对象，如果是 songs 说明是歌手页面用到该组件 palylist说明是排汗吧页面
        let list = res.data.songs ? res.data.songs : res.data.playlist;
        // 歌手页面需要用到该组件 根据不同页面 处理不同的数组传给封装好的子组件

        if (res.data.songs) {
          this.topFiveMusics = list.slice(0, 5);
        } else if (res.data.playlist) {
          // 排行榜页面需要用到该组件

          for (let index = 0; index < list.tracks.length; index++) {
            const tracksItem = list.tracks[index];

            // 如果热度指数存在，则赋值给tracksItem
            if (list.trackIds[index].ratio) {
              tracksItem.ratio = list.trackIds[index].ratio;
            }
          }
          this.topFiveMusics = list.tracks.slice(0, 5); // 取前五项 给子组件渲染出来

          this.musicList = list.tracks; // 该榜单的所有歌曲信息列表
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 跳转到歌单详情
    jumpMusicListDetail(id) {
      this.$router.push({
        path: "/musicList_detail",
        query: {
          id,
        },
      });
    },
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
  },
  components: {
    listSlot,
  },
};
</script>

<style lang="less" scoped>
#avatar_rank {
  .title {
    margin-top: 2%;
    h2 {
      font-weight: 600;
    }
  }
  .content {
    display: flex;
    align-items: center;
    .avatar:hover .play_wrap {
      opacity: 1;
      transition: .3s;
    }
    .avatar {
      position: relative;
      .cover {
        cursor: pointer;
        width: 180px;
        border-radius: 10px;
      }
      .play_wrap {
        position: absolute;
        cursor: pointer;
        opacity: 0;
        transform: translate(50%, -50%);
        top: 50%;
        right: 50%;
        width: 68px;
        border-radius: 10px;
        transition: .3s;
        .play_hidden {
          width: 100%;
        }
      }
    }
    .list_wrap {
      width: 75%;
      margin-left: 3%;
      .listSlot_wrap:nth-child(odd) {
        background-color: #f7f7f7;
      }
      .listSlot_wrap {
        border-radius: 10px;
        .index {
          color: red;
          font-size: 16px;
          text-align: center;
          font-weight: 600;
        }
        .tool {
          font-size: 12px;
          font-weight: 600;
        }
        .name_wrap {
          padding: 2.2%;
          padding-left: 6%;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }

        .art {
          width: 130px;
          display: flex;
          justify-content: flex-end;
          // flex-direction: row-reverse;
          white-space: nowrap;
          .artists_Wrap {
            display: inline-block;
            .artist_name {
              text-decoration: none;
              color: #666;
              cursor: pointer;
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
