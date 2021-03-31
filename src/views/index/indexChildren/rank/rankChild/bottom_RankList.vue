<template>
  <div id="BottomRank">
    <div class="title"><h2>全球榜</h2></div>
    <div class="list_wrap">
      <div
        class="list_item"
        v-for="BottomRankListItem in BottomRankList"
        :key="BottomRankListItem.name"
      >
        <div class="avatar">
          <div class="cover" @click="jumpMusicListDetail(BottomRankListItem.id)">
            <img class="coverImg" :src="BottomRankListItem.coverImgUrl" alt="" />
          </div>
          <div class="play_wrap" @click="AddAllMusic(BottomRankListItem.id)">
            <img class="play_hidden" src="@/assets/images/play1.png" alt="" />
          </div>
          <div class="playCount">
            <a-icon type="caret-right" />{{ BottomRankListItem.playCount }}
          </div>
        </div>
        <div class="name" @click="jumpMusicListDetail(BottomRankListItem.id)">
          {{ BottomRankListItem.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

import rankReq from "network/rankReq";
import {getRankMusicList} from 'network/rankReq';

export default {
  name: "BottomRank",
  data() {
    return {
      allMusic:[],
      musicItemArray:[]
    };
  },
  props: {
    BottomRankList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  created() {},
  methods: {
    ...mapActions(["AddAllRankMusicList"]),
    jumpMusicListDetail(id) {
      this.$router.push({
        path: "/musicList_detail",
        query: {
          id,
        },
      });
    },
    async getRankAllMusic(id){
      const res =  await getRankMusicList({id});
      this.allMusic = res.data.playlist.tracks;
    },
    // 点击歌单中心的 黑色播放按钮 将榜单中所有的歌曲 加进列表（vuex）中
    async AddAllMusic(id) {
      // 遍历榜单中 所有歌曲
      await this.getRankAllMusic(id);

      this.allMusic.forEach((music) => {
        // 构造vuex 中的musicItem
        let musicItem = {
          id: music.id,
          musicInfo: {
            br: music.m.br,
            size: music.m.size,
          },
          image_url: music.al.picUrl,
          title: music.al.name,
          artists: music.ar,
        };
        this.musicItemArray.push(musicItem);
      });

      this.AddAllRankMusicList(this.musicItemArray);
    },
  },
};
</script>

<style lang="less" scoped>
#BottomRank {
  .list_wrap {
    display: flex;
    flex-wrap: wrap;
    .list_item {
      padding: 1vw;
      .avatar:hover .play_wrap {
        opacity: 1;
      }
      .avatar {
        cursor: pointer;
        position: relative;
        .cover {
          .coverImg {
            width: 13vw;
            border-radius: 6px;
          }
        }
        .play_wrap {
          position: absolute;
          cursor: pointer;
          width: 6vw;
          opacity: 0;
          transform: translate(50%, -50%);
          top: 50%;
          right: 50%;
          .play_hidden {
            width: 100%;
          }
        }
        .playCount {
          position: absolute;
          top: 0;
          right: 10px;
          color: #fff;
        }
      }
      .name {
        width: 13vw;
        display: block;
      }
    }
  }
}
</style>
