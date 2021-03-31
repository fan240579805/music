<template>
  <div id="tableList">
    <div class="list_wrap">
      <table>
        <!-- 给每一列设置宽度 -->

        <col style="width: 1%" />
        <col style="width: 2%" />
        <col style="width: 5%" />
        <col style="width: 10%" />
        <col style="width: 10%" />
        <col style="width: 5%" />
        <tbody>
          <!-- 如果想在vue中执行for if 判断 则把 循环语句放在template中包裹住要循环的对象 tr 再tr上判断if 并且加上key -->
          <template v-for="(item, index) in mList">
            <tr
              v-if="OVER50"
              v-show="index < 10"
              :key="index"
              @dblclick="playMusic(item.id, item.name, item.al.picUrl, item.ar)"
            >
              <td>{{ index + 1 }}</td>
              <td><a-icon type="heart" /></td>
              <td class="name">{{ item.name }}</td>
              <td><span v-show="artistsFlag">aaa</span></td>
              <td><span v-show="artistsFlag">aaa</span></td>
              <td>{{ time(index) }}</td>
            </tr>
            <tr
              v-else
              :key="index"
              @dblclick="playMusic(item.id, item.name, item.al.picUrl, item.ar)"
            >
              <td>{{ index + 1 }}</td>
              <td><a-icon type="heart" /></td>
              <td class="name" :title="item.name">{{ item.name }}</td>
              <td><span v-show="artistsFlag">aaa</span></td>
              <td><span v-show="artistsFlag">aaa</span></td>
              <td>{{ time(index) }}</td>
            </tr>
          </template>
          <tr
            v-show="OVER50"
            @click="showMore"
            style="
              width: 58vw;
              cursor: pointer;
              background-color: #f6f6f6;
              border-radius: 5px;
            "
          >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>查看更多</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { showNum } from "@/utils/common.js";
import { mapActions } from "vuex";
import indexReq from "network/indexReq";
import { getAlbumDetail } from "network/singerReq";

export default {
  name: "tableList",
  created() {
    this.mList = this.list;
    this.judgeListLen();
    // 说明父组件没有传入 列表给tablelist这个子组件
    if (this.list.length == 0) {
      this.getMusicDetail(); // 自己去请求一下 歌
    }
  },
  mounted() {},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    listId: {
      type: Number,
      default: 0,
    },
    artistsFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      OVER50: false,
      mList: [],
    };
  },
  methods: {
    ...mapActions(["AddPlayListAction", "AddAllRankMusicList"]),
    judgeListLen() {
      if (this.mList.length > 10) {
        this.OVER50 = true;
      }
    },
    showMore() {
      this.OVER50 = !this.OVER50;
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
    async playMusic(id, title, image_url, artists) {
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
    // 获取专辑歌曲渲染到组件上
    async getMusicDetail() {
      const res3 = await getAlbumDetail({ id: this.listId });
      this.mList = res3.data.songs;
      this.judgeListLen();
    },
  },
  computed: {
    time() {
      return (index) => {
        if (this.list.length == 0) {
          if (this.mList[index].l === null) {
            return "00" + ":" + "00";
          }
          let musicTimeObj = this.mList[index].l
            ? this.mList[index].l
            : this.mList[index].m;
          //毫秒数转为时分秒
          let val = (musicTimeObj.size * 8) / musicTimeObj.br;
          let s = showNum(val % 60);
          let m = showNum((val / 60) % 60);
          // let h = parseInt(val / 60 / 60);
          return m + ":" + s;
        } else {
          let musicTimeObj = this.list[index].l ? this.list[index].l : this.list[index].m;
          //毫秒数转为时分秒

          let val = (musicTimeObj.size * 8) / musicTimeObj.br;
          let s = showNum(val % 60);
          let m = showNum((val / 60) % 60);
          // let h = parseInt(val / 60 / 60);
          return m + ":" + s;
        }
      };
    },
  },
};
</script>

<style lang="less" scoped>
#tableList {
  .list_wrap {
    table {
      margin: 0;
      padding: 0;
      table-layout: fixed;

      tr:nth-child(odd) {
        background-color: #f7f7f7;
      }
      tr {
        td {
          padding: 5px 10px;
        }
        .name {
          min-width: 200px;
          max-width: 200px;
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
