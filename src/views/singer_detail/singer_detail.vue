<template>
  <div id="singerDetail" v-if="singerInfo">
    <div class="list_Info">
      <div class="coverImg">
        <img :src="singerInfo.artist.cover" alt="" width="200" height="200" />
      </div>
      <div class="intro">
        <div class="title">
          <div class="list_type"></div>
          <h2 style="font-weight: 600">{{ singerInfo.artist.name }}</h2>
          <!-- <div class="nickname">{{}}</div> -->
        </div>
        <div class="button_wrap">
          <div class="OtherBtn">
            <a-icon type="file-add" style="font-size: 20px; margin-right: 10px" />收藏
          </div>
        </div>
        <div class="total_wrap">
          <div class="Count">单曲数:{{ singerInfo.artist.musicSize }}</div>
          <div class="Count">专辑数:{{ singerInfo.artist.albumSize }}</div>
          <div class="Count">MV数:{{ singerInfo.artist.mvSize }}</div>
        </div>
      </div>
    </div>
    <div class="song_album">
      <div class="albumItem">
        <div class="albumImg1"><img src="@/assets/images/top.png" alt="" /></div>

        <div class="album_music">
          <h3 class="title" style="font-weight: 600">top50热歌</h3>
          <tableList :list="top50songs" />
        </div>
      </div>
      <div class="albumItem" v-for="item in albumList" :key="item.id">
        <div class="albumImg">
          <img
            v-lazy="item.picUrl"
            alt=""
            @click="
              $router.push({ path: '/album_detail', query: { id: item.id, type: album } })
            "
          />
          <div class="pushiTime" style="padding: 10px; font-size: 14px">
            {{ item.publishTime | formatDate }}
          </div>
        </div>
        <div class="album_music">
          <h3 class="title" style="font-weight: 600">{{ item.name }}</h3>
          <tableList :listId="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSingerDetail, getTop50Songs, getAlbum } from "network/singerReq";
import { showNum, formatDate } from "@/utils/common.js";
import tableList from "components/tableList/tableList";
export default {
  name: "singerDetail",
  data() {
    return {
      singerInfo: null,
      top50songs: [],
      albumList: [],
      albumSongs: [],
    };
  },
  created() {
    this.getSingerData();
  },
  methods: {
    async getSingerData() {
      const res = await getSingerDetail({ id: this.$route.query.id });

      const res1 = await getTop50Songs({ id: this.$route.query.id });

      const res2 = await getAlbum({ id: this.$route.query.id });

      this.singerInfo = res.data.data;
      this.top50songs = res1.data.songs;
      this.albumList = res2.data.hotAlbums;
    },
  },
  components: {
    tableList,
  },
  filters: {
    formatDate,
  },
};
</script>

<style lang="less" scoped>
#singerDetail {
  .list_Info {
    margin-top: 30px;
    display: flex;

    .coverImg {
      border: 1px solid #d3d1d1;
      border-radius: 3px;
      box-sizing: border-box;
    }
    .intro {
      margin-left: 20px;
      .nickname {
        margin-bottom: 15px;
      }
      .button_wrap {
        .OtherBtn {
          padding: 5px 10px;
          width: 90px;
          border: 1px solid #d3d1d1;
          border-radius: 17px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
      }
      .button_wrap :hover {
        cursor: pointer;
        background-color: #eee;
      }
      .total_wrap {
        display: flex;
        .Count {
          padding-right: 15px;
        }
      }
    }
  }
  .albumItem {
    margin-top: 30px;
    display: flex;
    justify-content: start;
    .albumImg {
      img {
        width: 200px;
        height: 200px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .albumImg1 {
      img {
        width: 200px;
        height: 200px;
        border-radius: 5px;
      }
    }
    .album_music {
      width: 60vw;
      margin-left: 5vw;
    }
  }
}
</style>
