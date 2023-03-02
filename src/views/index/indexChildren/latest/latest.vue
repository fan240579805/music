<template>
  <div id="latest">
    <div class="info" style="text-align: center">新歌推荐</div>
    <div class="tab"></div>
    <div class="table1">
      <table>
        <!-- 给每一列设置宽度 -->
        <col style="width: 3%" />
        <col style="width: 1%" />
        <col style="width: 20%" />
        <col style="width: 14%" />
        <col style="width: 14%" />
        <col style="width: 6%" />
        <tbody>
          <tr
            v-for="(item, index) in latestList"
            :key="item.id"
            @dblclick="dbPlay(item.id, item.name, item.album.picUrl, item.artists)"
          >
            <td class="index">{{ index + 1 }}</td>
            <td class="coverWrap">
              <img :src="item.album.picUrl" alt="" class="cover" />
            </td>
            <td class="name">{{ item.name }}</td>
            <td class="artists">
              <div class="wrap" v-for="(arItem, index) in item.artists" :key="arItem.id">
                <router-link
                  :to="{ path: '/singer_detail', query: { id: arItem.id } }"
                  class="artist_name"
                  :title="arItem.name"
                >
                  {{ arItem.name }}
                </router-link>
                <span v-if="formatName(item.artists, arItem.name)"> &nbsp/&nbsp </span>
              </div>
            </td>
            <td class="album">
              <span>{{ item.album.name }}</span>
            </td>
            <td>13:00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getLatestMusic } from "network/indexReq";
import indexReq from "network/indexReq";

import { mapActions } from "vuex";
import { nameArrayFormatMixin, playAllMusicListMixin } from "@/utils/mixin.js";
export default {
  name: "latest",
  mixins: [nameArrayFormatMixin, playAllMusicListMixin], // 混入
  data() {
    return {
      latestList: [],
    };
  },
  created() {
    this.getMList();
  },

  methods: {
    ...mapActions(["AddPlayListAction", "AddAllRankMusicList"]),
    async getMList() {
      const res = await getLatestMusic();
      this.latestList = res.data.data;
      console.log(res);
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
};
</script>

<style lang="less" scoped>
#latest {
  padding-top: 49px;
  .table1 {
    table {
      margin: 0;
      padding: 0;
      table-layout: fixed;
      tr:nth-child(odd) {
        background-color: #f7f7f7;
      }
      tr {
        td {
          padding: 10px 5px;
        }
        .coverWrap {
          text-align: center;
          padding-right: 10px;
        }
        .index {
          text-align: center;
        }
        .cover {
          width: 65px;
          height: 65px;
          border-radius: 4px;
        }
        .name {
          min-width: 200px;
          max-width: 200px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
        .artists {
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
          .wrap {
            display: inline-block;
          }
          .artist_name {
            color: rgb(151, 149, 149);
            text-decoration: none;
          }
          .artist_name :hover {
            color: #333 !important;
          }
        }
        .album {
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
      }
      tr:hover {
        background-color: #eee;
      }
    }
  }
}
</style>
