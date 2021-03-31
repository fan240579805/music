<template>
  <div id="xs_Play_list">
    <div class="title">播放列表</div>
    <div class="tool">
      <div class="total_song">总{{ PlayListLength }}首</div>
      <div class="tool_btns">
        <div class="collect_all">收藏全部</div>
        <div class="clear_all">清除全部</div>
      </div>
    </div>
    <div class="list">
      <div
        class="list_item"
        v-for="(GetPlayListitem, index) in GetPlayList"
        :key="index"
        :class="{ list_item_active: GetPlayListitem.willPlayFlag }"
        @dblclick="dbClickPlay(GetPlayListitem.id)"
      >
        <div class="playtag" :class="{ activeTag: GetPlayListitem.willPlayFlag }">
          <div v-show="playStatus">
            <a-icon type="play-circle" />
          </div>
          <div v-show="!playStatus">
            <a-icon type="pause" />
          </div>
        </div>

        <div class="song_title">
          <span>{{ GetPlayListitem.title }}</span>
        </div>
        <div class="wrap">
          <div class="artists">
            <span>
              <div
                class="artist_wrap"
                v-for="artist in GetPlayListitem.artists"
                :key="artist.name"
              >
                <a href="" class="artist_name" :title="artist.name">{{ artist.name }}</a>

                <span v-if="formatName(GetPlayListitem.artists, artist.name)"
                  >&nbsp/&nbsp</span
                >
              </div>
            </span>
          </div>
          <div class="song_time">
            {{ Songtime(index) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { showNum } from "@/utils/common.js";
import { nameArrayFormatMixin } from "@/utils/mixin.js";

export default {
  name: "xs_Play_list",
  mixins: [nameArrayFormatMixin], // 混入格式化 歌手名称文件
  created() {},
  props: {
    // 播放状态，表示当前哪首歌的播放状态是正在播放还是暂停
    playStatus: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    ...mapGetters(["PlayListLength", "GetPlayList", "willPlayMusicItem"]),
    Songtime() {
      return (index) => {
        let songTime =
          (this.GetPlayList[index].musicInfo.size * 8) /
          this.GetPlayList[index].musicInfo.br;
        let s = showNum(songTime % 60);
        let m = showNum((songTime / 60) % 60);
        return m + ":" + s;
      };
    },
  },
  methods: {
    ...mapActions(["changePlaylistPlayingMusic"]),
    dbClickPlay(id) {
      this.changePlaylistPlayingMusic(id);
    },
  },
};
</script>

<style lang="less" scoped>

#xs_Play_list {
  position: absolute;
  z-index: 9999;
  width: 500px;
  height: 80vh;
  top: -80vh;
  right: 0;
  background-color: #fff;
  color: #333;
  box-shadow: 1px 1px 5px rgb(207, 204, 204);
  border-radius: 5px;
  border: 1px solid #eee;
  overflow: hidden;
  overflow-y: scroll; //上下滚动
  .title {
    text-align: center;
  }
  .tool {
    padding: 20px;

    display: flex;
    .total_song {
      flex: 1;
      color: rgb(131, 127, 127);
    }
    .tool_btns {
      flex: 1;
      display: flex;
      .clear_all {
        flex: 1;
      }
      .collect_all {
        flex: 1;
      }
    }
  }

  .list {
    .list_item:nth-child(even) {
      background: #f5f5f5;
    }
    .list_item:hover {
      background-color: #e9e9e9;
      .wrap {
        .song_time {
          color: #000;
        }
      }
    }

    .list_item {
      padding: 5px 20px 5px 0px;
      flex: 1;
      display: flex;
      .playtag {
        float: left;
        padding-left: 2px;
        opacity: 0;
      }
      .activeTag {
        opacity: 1;
      }
      .song_title {
        padding-left: 7px;
        width: 150px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        margin-right: 80px;
      }
      .wrap {
        flex: 1;
        display: flex;

        .artists {
          color: #666;
          width: 100px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
          font-size: 13px;
          margin-right: 15px;
          margin-left: 6px;
          span {
            .artist_wrap {
              display: inline;
              cursor: auto;
              .artist_name {
                color: inherit;
                text-decoration: none;
                border: none;
                -webkit-tap-highlight-color: #333;
                -webkit-user-select: none;
                -moz-user-focus: none;
                -moz-user-select: none;
              }
            }
          }
        }

        .song_time {
          flex: 1;
          color: #9999;
        }
      }
    }
    .list_item_active {
      background-color: #e9e9e9;
      color: red;
      .song_title {
        color: red;
      }
      .wrap {
        .artists {
          color: red;
        }
      }
    }
  }
}
</style>
