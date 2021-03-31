<template>
  <div id="geci">
    <div class="geci_wrap">
      <div class="cover">
        <div class="cover_wrap">
          <img class="border" src="@/assets/images/album_border.png" alt="" />
          <img class="pointer" src="@/assets/images/album_pointer.png" alt="" />
          <img
            class="coverImg"
            :src="alias.picUrl"
            alt=""
            :style="{ 'animation-play-state': animationShow }"
          />
        </div>
      </div>
      <div class="ci">
        <h1>{{ name }}</h1>
        <div class="songInfo">
          <span class="album"
            >专辑：<router-link :to="{ path: '/singer_detail' }" :title="alias.name">{{
              alias.name
            }}</router-link></span
          >
          <div class="artist">
            歌手：

            <span v-for="item in artists" :key="item.id">
              <router-link
                class="artist_name"
                :to="{ path: '/singer_detail', query: { id: item.id } }"
                :title="item.name"
                >{{ item.name }}</router-link
              >
              <span v-if="formatName(artists, item.name)">&nbsp/&nbsp</span>
            </span>
          </div>
        </div>
        <div class="cilist" ref="ciList">
          <ul ref="lyricUL">
            <li
              ref="lyricli"
              v-for="(item, index) in ciTimeArr"
              :key="item.id"
              :class="{ active_geci: index === curIndex }"
            >
              {{ item.ci }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nameArrayFormatMixin } from "@/utils/mixin.js";
export default {
  name: "geci",
  mixins: [nameArrayFormatMixin],
  data() {
    return {
      animationShow: "running",
      status: false,
      ciTimeArr: [],
      curIndex: 0, // 当前时间数组在哪个index
    };
  },
  props: {
    artists: {
      type: Array,
      default() {
        return [];
      },
    },
    alias: {
      type: Object,
      default() {
        return {};
      },
    },
    geci: {
      type: Object,
      default() {
        return {};
      },
    },
    name: {
      type: String,
      default: "",
    },
    musicCurrentTime: {
      Type: Number,
      default: 0,
    },
  },
  computed: {},
  watch: {
    // 监听父组件传过来的播放状态来控制 动画
    status(val) {
      if (val) {
        this.animationShow = "running";
      } else {
        this.animationShow = "paused";
      }
    },
    // 歌词传进来了 处理成两个数组以便后续滚动
    geci(val) {
      if (!val.lrc) {
        this.ciTimeArr.push({ ci: "暂无歌词" });
        return;
      }
      // 新的歌词来 清空原来的数组
      this.ciTimeArr = [];
      // 将歌词分为 rows 数组
      let rows = val.lrc.lyric.split("\n");

      rows.forEach((row, index) => {
        let beRemoveT = row.split("]")[0];
        let timeString = beRemoveT.substring(
          beRemoveT.indexOf("[") + 1,
          beRemoveT.length - 1
        );
        // 把时分秒 转成秒
        let min = parseInt(timeString.split(":")[0]);
        let sec = parseFloat(timeString.split(":")[1]);
        let songtime = parseFloat((min * 60 + sec).toFixed(3));
        let ci = row.split("]")[1];
        let ciTimeObj = {};
        // 将有效歌词 时间处理成对象推入数组
        let id = Math.random();
        if (ci && ci.length >= 2) {
          ciTimeObj = {
            songtime,
            ci,
            id,
          };
        }
        this.ciTimeArr.push(ciTimeObj);
      });
      // 获得时间数组和歌词数组
    },
    // 监听播放组件当前播放时间
    musicCurrentTime(val) {
      this.ciTimeArr.forEach((item, index) => {
        if (Math.abs(val - item.songtime) < 0.5) {
          this.curIndex = index;
          if (index > 4 && index < this.ciTimeArr.length - 4) {
            // 计算每次需要滚动多少高度
            let sH = 0;
            for (let i = 0; i < index - 2; i++) {
              sH += this.$refs.lyricli[i].clientHeight; //前index-2每个li的高度累加
            }
            // 滚动
            this.$refs.ciList.scrollTo({
              left: 0,
              top: sH,
              behavior: "smooth",
            });
            //(this.$refs.lyricli[index].clientHeight / 1.2)
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#geci {
  height: 450px;
  margin-top: 20px;
  .geci_wrap {
    display: flex;
    height: 100%;
    .cover {
      width: 40%;
      /*自定义动画类----顺时针旋转（使用这个动画的时候才设置动画执行时间）*/
      @-webkit-keyframes changeright {
        0% {
          -webkit-transform: rotate(0deg);
        }

        50% {
          -webkit-transform: rotate(180deg);
        }

        100% {
          -webkit-transform: rotate(360deg);
        }
      }
      .cover_wrap {
        font-size: 0;
        padding-top: 140px;
        padding-left: 20px;
        position: relative;
        height: 300px;
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;

        .border {
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background-color: #eee;
        }
        .pointer {
          position: absolute;
          height: 170px;
          z-index: 9999;
          top: -3%;
          right: 3%;
        }

        .coverImg {
          display: block;
          width: 230px;
          border-radius: 50%;
          top: 50%;
          right: 50%;
          border: 10px solid rgb(26, 25, 25);
          box-shadow: 10px 10px 10px rgb(51, 51, 51);
          z-index: 1;
          animation: changeright 24s linear infinite;
        }
      }
    }
    .ci {
      width: 50%;
      padding-top: 20px;
      height: 100%;
      .songInfo {
        display: flex;

        .artist {
          font-size: 13px;
          padding: 0 10%;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
        .album {
          font-size: 13px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
        }
      }
      .cilist {
        margin-top: 20px;
        font-weight: 500;
        width: 80%;
        height: 80%;
        overflow: hidden;
        overflow-y: scroll;

        .active_geci {
          font-size: 18px;
          font-weight: 700;

          color: #000;
        }
        ul {
          padding: 0px;
          li {
            padding: 20px;
            padding-left: 0px;
            list-style: none;
          }
        }
      }
    }
  }
}
</style>
