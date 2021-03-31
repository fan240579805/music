<template>
  <div id="rank">
    <div
      class="avatarMusicList_wrap"
      v-for="TopRankListItem in TopRankList"
      :key="TopRankListItem.id"
    >
      <avatarMusicList
        :rankInfo="rankInfoObj(TopRankListItem.id, TopRankListItem.name, TopRankListItem.coverImgUrl, TopRankListItem.updateTime)"
      />
    </div>
    <bottomRankListPage :BottomRankList="bottomRankList" style="margin-top:20px"/>
  </div>
</template>

<script>
import rankReq from "network/rankReq";

import listSlot from "components/common/listSlot/listSlot";
import avatarMusicList from "./rankChild/avatar_musicList";
import bottomRankListPage from './rankChild/bottom_RankList';

export default {
  name: "rank",
  data() {
    return {
      rankDetailInfo: {},
      TopRankList: [],
      bottomRankList: [],
    };
  },
  created() {
    this.getRankList();
  },
  methods: {
    async getRankList() {
      try {
        const res = await rankReq.getAllRank();
        // 将请求到的榜单数组list 分为上下两个部分
        this.TopRankList = res.data.list.slice(0, 4);
        this.bottomRankList = res.data.list.slice(4, res.data.list.length);  

      } catch (error) {
        console.log(error);
      }
    },

  },
  computed: {
    // 将需要的数据格式化为对象 不需要的数据不格式化 传递给子组件
    rankInfoObj(){
      return (id,name,coverImgUrl,updateTime) =>{
        return {id,name,coverImgUrl,updateTime};
      }
    }
  },
  components: {
    listSlot,
    avatarMusicList,
    bottomRankListPage
  },
};
</script>

<style lang="less" scoped>
#rank {
  padding-top: 49px;
  .listSlot_wrap {
    width: 70%;
    .end {
      text-align: center;
    }
  }
}
</style>
