<template>
  <div id="songDetail">
    <div class="wrap">
      <div class="song_area">
        <div class="ci_area">
          <geci
            ref="geci"
            :artists="FatherArtists"
            :alias="FatherAlias"
            :geci="FatherGeci"
            :name="Fname"
            :musicCurrentTime="musicCurTime"
          />
        </div>
        <div class="songText"></div>
      </div>
      <div class="relateArea">
        <div class="comments">
          <comment
            :propsHotComments="hotlist"
            :propsAllComments="allList"
            :propstotal="total"
            :status="playStatus"
          />
        </div>
        <div class="recommend">推荐</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSongComments } from "network/songReq";

import geci from "components/music_geci/music_geci";
import comment from "components/commend/commend";
export default {
  name: "SD",
  data() {
    return {
      id: null,
      songDetailFlag: false, // 标记是否展示详情页面
      playStatus: false,
    };
  },
  created() {},
  mounted() {},
  props: {
    hotlist: {
      type: Array,
      default() {
        return [];
      },
    },
    allList: {
      type: Array,
      default() {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    FatherArtists: {
      type: Array,
      default() {
        return [];
      },
    },
    FatherAlias: {
      type: Object,
      default() {
        return {};
      },
    },
    FatherGeci: {
      type: Object,
      default() {
        return {};
      },
    },
    Fname: {
      type: String,
      default: "",
    },
    musicCurTime: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    async getComments() {
      let limit = 30;

      try {
        const res = await getSongComments({ id: this.id, limit });
        console.log(res);
        this.allLits = res.data.comments;
        this.hotlist = res.data.hotComments;

        this.total = res.data.total;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    playStatus(val) {
      this.$refs.geci.status = val;
    },
  },
  components: {
    geci,
    comment,
  },
};
</script>

<style lang="less" scoped>
#songDetail {
  position: absolute;
  bottom: 75px;
  left: 0;
  height: calc(100vh - 60px - 75px);
  z-index: 9999;
  width: 100vw;
  background-color: #fff;
  transform-origin: left bottom;
  overflow: hidden;
  overflow-y: scroll; //上下滚动
  margin: 0 auto;
  .wrap {
    width: 80%;
    margin: 0 auto;
    .relateArea {
      display: flex;
      .comments {
        width: 60%;
      }
    }
  }
}
</style>
