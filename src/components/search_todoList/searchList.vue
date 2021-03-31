<template>
  <div id="search_list" @click.stop>
    <div class="navbar_tool_search">
      <a-icon class="search-icon" type="search" />
      <a-input
        @click="clickInputKUANG"
        @input="input"
        @keydown="enterHandle"
        class="in"
        placeholder="请输入搜索内容"
      />
    </div>
    <!--未输入时的列表 -->
    <div class="list_Wrap" v-show="clickFlag">
      <!-- 有搜索历史才渲染 -->
      <h3 style="padding: 10px" v-if="searchHistory.length > 0">搜索历史</h3>
      <div class="todolist" v-if="searchHistory.length > 0">
        <div
          class="listItem"
          v-for="(Historyitem, index) in searchHistory"
          @mouseenter="hoverHandle(index)"
          @mouseleave="leaveHandle(index)"
          :key="Historyitem.id"
        >
          {{ Historyitem.val }}
          <span
            v-show="Historyitem.showDelete"
            style="padding: 0 0 0 5px"
            @click="deleteHistoryItem(index)"
            >X</span
          >
        </div>
      </div>
      <div class="hotSearch">
        <h3 style="padding: 0 10px">热搜榜</h3>
        <ul>
          <li class="hotlistItem" v-for="(item, index) in hotList" :key="item.score">
            <p class="index" :class="{ activeRank: index <= 2 }">{{ index + 1 }}</p>
            <div class="info">
              <div class="title_wrap">
                <span class="title" :class="{ activeRankT: index <= 2 }">{{
                  item.searchWord
                }}</span>

                <span
                  v-if="index <= 2"
                  style="font-weight: 600; font-size: 12px; color: red; padding: 0 5px"
                  >hot</span
                >
                <span style="color: #3333; padding: 0 5px">{{ item.score }}</span>
              </div>
              <span class="desc">{{ item.content }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 输入时的列表 -->
    <div class="list_Wrap" v-show="inpFlag">
      <div class="list">
        <h3 style="padding: 0 10px">相关结果</h3>
        <ul>
          <li class="searchItem" v-for="(item, index) in searchList" :key="item.id">
            <div class="music_info" @click="dbClickPlay(item.id)">
              {{ item.name }} - {{ item.artists[0].name }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import indexReq from "network/indexReq";
import { getMusicDetail } from "network/songReq";
import { search, GetHotList } from "network/searchReq";
var debonuce = function (fnName, delay) {
  let timer = null;
  // e 实参
  return function (e) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // this -> vue
      this[fnName](e); // 利用传进来的函数名执行并将e传给要执行的函数
    }, delay);
  };
};
export default {
  name: "searchList",
  data() {
    return {
      deleteFlag: false,
      inpFlag: false, // 控制输入列表
      clickFlag: false, // 控制点击列表
      inpVal: "", // 输入的值
      searchHistory: [], //搜索历史
      hotList: [], // 热搜
      searchList: [], //搜索列表
      musicOBJ: {}, // 歌曲对象结构体 用于存歌曲信息并传给vuex
    };
  },
  created() {
    this.HotList();
  },
  mounted() {
    // 点击除自身组件之外的地方 会隐藏该组件
    document.body.addEventListener(
      "click",
      () => {
        this.inpFlag = false;
        this.clickFlag = false;
      },
      false
    );
  },
  props: {
    // 播放状态，表示当前哪首歌的播放状态是正在播放还是暂停
    playStatus: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {},
  methods: {
    ...mapActions(["changePlaylistPlayingMusic", "AddPlayListAction"]),
    async dbClickPlay(id) {
      await this.getMusicUrlData(id);
      this.AddPlayListAction(this.musicOBJ);
    },
    // 请求 对应的歌曲url 和歌曲详情信息
    async getMusicUrlData(id) {
      try {
        const res = await indexReq.getMusicUrl({ id });
        const resDetail = await getMusicDetail({ ids: id });
        let realData = resDetail.data.songs[0];
        let musicInfo = res.data.data[0];
        let image_url = realData.al.picUrl;
        let artists = realData.ar;
        let title = realData.name;
        this.musicOBJ = {
          artists,
          id,
          image_url,
          musicInfo,
          title,
        };
      } catch (error) {
        console.log(error);
      }
    },
    //点击输入框事件
    clickInputKUANG() {
      if (this.inpVal !== "") {
        this.inpFlag = true;
        this.clickFlag = false;
      } else {
        this.clickFlag = true;
        this.inpFlag = false;
      }
    },
    //输入事件
    input(e) {
      this.debonuceInput(e);
    },
    // 防抖处理 输入事件函数
    debonuceInput: debonuce("inputHandle", 300),
    // 执行的行为
    inputHandle(e) {
      if (e.target.value === "") {
        this.inpVal = "";
        this.clickFlag = true;
        this.inpFlag = false;
      } else {
        this.clickFlag = false;
        this.inpFlag = true;
        this.inpVal = e.target.value;
        this.getSearchReq();
      }
    },
    // 请求搜索到的内容
    async getSearchReq() {
      let keywords = this.inpVal;
      const res = await search({ keywords });
      this.searchList = res.data.result.songs;
    },
    // 获取热搜
    async HotList() {
      const res = await GetHotList();
      this.hotList = res.data.data;
    },
    // 回车事件
    enterHandle(e) {
      // 用户按下了回车键
      if (e.keyCode === 13) {
        // 搜素历史中不存在这个输入的value ，添加进数组
        if (this.searchHistory.indexOf(this.inpVal) === -1) {
          let obj = {
            val: e.target.value,
            id: Math.random(),
            showDelete: false,
          };
          this.searchHistory.push(obj);
        }
      }
    },
    // 鼠标悬浮在搜索历史上面事件
    hoverHandle(index) {
      this.searchHistory.forEach((item, i) => {
        if (i === index) {
          item.showDelete = true;
        }
      });
    },
    // 鼠标离开在搜索历史上面事件
    leaveHandle(index) {
      this.searchHistory.forEach((item, i) => {
        if (i === index) {
          item.showDelete = false;
        }
      });
    },
    // 删除某个搜索历史
    deleteHistoryItem(index) {
      this.searchHistory.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
#search_list {
  display: flex;
  align-items: center;
  position: relative;
  .navbar_tool_search {
    position: relative;
    width: 70%;
    .search-icon {
      position: absolute;
      left: 3%;
      top: 32%;
      z-index: 999;
    }
    .in {
      padding-left: 20px;
    }
  }
  .list_Wrap {
    width: 400px;
    height: 500px;
    overflow: hidden;
    overflow-y: scroll; //上下滚动
    position: absolute;
    top: 110%;
    left: -50%;
    //border: 1px solid #eeee;
    background-color: #f9f9f9;
    z-index: 9999;
    border-radius: 7px;
    box-shadow: 0px 0px 10px -5px;
    .todolist {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      .listItem {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 30px;
        border-radius: 20px;
        padding: 10px;
        margin: 5px 10px;
        border: 1px solid #3333;

        text-align: center;
        cursor: pointer;
      }
      .listItem:hover {
        background-color: #f5f5f5;
      }
    }
    .hotSearch {
      margin: 15px 0;
      ul {
        padding: 0;
      }
      .hotlistItem {
        list-style: none;
        padding: 11px;
        display: flex;
        .activeRank {
          color: red;
          font-weight: 700;
          font-size: 16px;
        }
        .activeRankT {
          font-weight: 800 !important;
          color: #000;
          font-size: 14px;
        }
        .index {
          width: 10px;
        }
        .info {
          margin-left: 20px;
          .title_wrap {
            display: flex;
            .title {
              font-weight: 400;
            }
          }

          .desc {
            color: #999797;
            font-size: 13px;
          }
        }
        span {
          display: block;
        }
      }
      .hotlistItem:hover {
        cursor: pointer;
        background-color: #eeee;
      }
    }
    .list {
      ul {
        padding: 0;
        .searchItem {
          list-style: none;
          cursor: pointer;
          padding: 5px;
          .music_info {
            font-size: 13px;
            padding-left: 10px;
          }
        }
        .searchItem:hover {
          list-style: none;
          background-color: #eeee;
        }
      }
    }
  }
}
</style>
