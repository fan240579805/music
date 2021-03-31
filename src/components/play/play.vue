<template>
  <div id="play">
    <!-- 歌曲详情组件 :class="{ song_detail: flag }"-->
    <songDetail
      v-show="id"
      ref="songDetail"
      :class="{ song_detail: flag }"
      :hotlist="hotlist"
      :allList="allLits"
      :total="total"
      :FatherArtists="Artists"
      :FatherAlias="Alias"
      :FatherGeci="Geci"
      :Fname="MusicName"
      :musicCurTime="mTime"
      class="song_detail_act"
      @click.native="showPlayList = false"
    />
    <!-- 歌曲信息 -->
    <div class="music_info">
      <div class="music_info_Wrap" v-if="willPlayMusicItem">
        <div class="imgwrap">
          <div class="hoverBCK" @click="showSongDetail"></div>
          <img class="music_avatar" v-lazy="willPlayMusicItem.image_url" alt="" />
        </div>
        <div class="music_detail">
          <div class="music_name" @click="showSongDetail">
            {{ willPlayMusicItem.title }}
          </div>
          <div
            class="music_auther"
            @click="$router.push({ path: '/singer_detail', query: { id: artist.id } })"
            v-if="willPlayMusicItem.artists"
          >
            <span v-for="item in willPlayMusicItem.artists" :key="item.id">
              <router-link
                class="artist_name"
                :to="{ path: '/singer_detail', query: { id: item.id } }"
                :title="item.name"
                >{{ item.name }}</router-link
              >
              <span v-if="formatName(willPlayMusicItem.artists, item.name)"
                >&nbsp/&nbsp</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 操作按钮 -->
    <div class="play_audio">
      <div class="operators">
        <div
          class="mode"
          style="cursor: pointer"
          @click="changeMode"
          title="切换播放模式"
        >
          <img
            v-show="playMode === 0"
            src="@/assets/images/列表循环.png"
            alt=""
            style="width: 27px"
          />
          <img
            v-show="playMode === 2"
            src="@/assets/images/随机播放.png"
            alt=""
            style="width: 27px"
          />
          <img
            v-show="playMode === 1"
            src="@/assets/images/单曲循环.png"
            alt=""
            style="width: 27px"
          />
        </div>
        <div @click="fastBack" class="i-left">
          <a-icon class="operators_icon" type="step-backward" />
        </div>

        <a-icon
          type="play-circle"
          v-show="!playing"
          @click="changeStatus"
          style="font-size: 30px; margin: 0 14px"
        />
        <a-icon
          type="pause-circle"
          v-show="playing"
          @click="changeStatus"
          style="font-size: 30px; margin: 0 14px"
        />

        <div @click="forward" class="i-left">
          <a-icon class="operators_icon" type="step-forward" />
        </div>
      </div>
      <div class="process_cpns">
        <div class="currentDuration">{{ currentDuration }}</div>
        <div class="progress-bar-wrapper" ref="progressBarWrapper">
          <div class="progress-bar" ref="progressBar" @click="progressClick">
            <div class="bar-inner">
              <div class="progress" ref="progress"></div>
              <div
                class="progress-btn-wrapper"
                ref="progressBtn"
                @mousedown="processBtnDown"
              >
                <div class="progress-btn"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="totalDuration">{{ totalDuration }}</div>
        <div v-if="willPlayMusicItem">
          <audio
            :src="willPlayMusicUrl"
            controls
            id="maudio"
            ref="maudio"
            preload="auto"
            autoplay
            style="display: none"
            @timeupdate="onTimeupdate"
            @ended="audioEnd"
          ></audio>
        </div>
      </div>
    </div>
    <!-- 播放列表操纵 -->
    <div class="play_tool">
      <div class="play_tool_wrap">
        <div class="loudly">
          <img src="@/assets/images/louder_line.png" alt="" style="width: 30px" />
          <div class="progress-bar-wrapper" ref="volumeBarWrapper">
            <div class="progress-bar" ref="volumeBar" @click="progressVolume">
              <div class="bar-inner">
                <div
                  class="progress"
                  ref="volume"
                  :style="{ width: VoLpercent === 1 ? 80 + 'px' : '' }"
                ></div>
                <div
                  class="volumeBtn"
                  ref="volumeBtn"
                  @mousedown="volumeBtnDown"
                  :style="{ left: VoLpercent === 1 ? 78 + 'px' : vBtnLeft + 'px' }"
                >
                  <div class="progress-btn"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="small_play_list">
          <a-icon class="list_btn" type="menu-unfold" @click.stop="playListBtnClick" />
        </div>
      </div>
    </div>
    <!-- 播放列表组件 -->
    <xsPlaylist v-show="showPlayList" :playStatus="playing" />
  </div>
</template>

<script>
/**vue */
import { mapGetters, mapActions, mapState } from "vuex";
import { showNum } from "@/utils/common.js";
import { nameArrayFormatMixin } from "@/utils/mixin.js";
/**请求 */
import indexReq from "network/indexReq";
import { getSongComments, getMusicDetail, getGeci } from "network/songReq";
/**组件 */
import xsPlaylist from "components/small_play_list/xsPlayList";
import songDetail from "views/song_detail/songdetail";
export default {
  name: "play",
  mixins: [nameArrayFormatMixin], // 混入格式化 歌手名称文件
  data() {
    return {
      currentTime: 0,
      currentDuration: "00:00",
      totalDuration: "00:00",
      percent: 0,
      VoLpercent: 1,
      id: null,
      playing: true, // 播放状态
      showPlayList: false,
      URL: "",
      flag: true, // 控制组件样式
      childData: true,
      // 传给子组件的评论信息
      allLits: [],
      hotlist: [],
      total: 0,
      // 传给子组件的 歌曲信息
      MusicName: "",
      Artists: [],
      Alias: {},
      Geci: {},
      mTime: 0,
      // 标记歌播放模式 0列表顺序播放 1 单曲循环 2 随机播放
      playMode: 0,
      // 音量按钮的偏移量
      vBtnLeft: -2,
    };
  },
  created() {},
  //     码率        "br": 320000,
  //     文件大小    "size": 10691439,     size * 8 / br = 歌曲时长
  methods: {
    ...mapActions(["takeChangeMusic"]),
    ...mapState(["ChangeMusicStatus"]),
    // 歌曲一进来，组件的播放时间赋值
    onTimeupdate(e) {
      this.currentTime = parseInt(e.target.currentTime);
      this.mTime = parseFloat(e.target.currentTime.toFixed(3));
    },
    //上一首歌
    fastBack() {
      let params = {
        id: this.willPlayMusicItem.id,
        OpreateStatus: false,
      };

      this.takeChangeMusic(params); //操作vuex 改变播放状态
    },
    //改变播放状态
    changeStatus() {
      if (this.playing) {
        this.$refs.maudio.pause();
      } else {
        this.$refs.maudio.play();
      }
      this.playing = !this.playing;
    },
    //下一首歌
    forward() {
      // let params = {
      //   id: this.willPlayMusicItem.id,
      //   OpreateStatus: true,
      // };
      // this.takeChangeMusic(params); //操作vuex 改变播放状态
      this.playMethod();
    },
    //处理
    handle(val) {
      //毫秒数转为时分秒
      let s = showNum(val % 60);
      let m = showNum((val / 60) % 60);
      // let h = parseInt(val / 60 / 60);
      this.currentDuration = m + ":" + s;
      this.percent =
        val /
        ((this.willPlayMusicItem.musicInfo.size * 8) /
          this.willPlayMusicItem.musicInfo.br);
    },
    //播放结束 修改播放状态
    audioEnd() {
      this.playMethod();
    },
    //随机播放，循环播放逻辑
    playMethod() {
      //获取当前结束的歌曲id
      if (this.playMode === 0) {
        //，顺序播放的话，自动播放下一首歌
        let params = {
          id: this.willPlayMusicItem.id,
          OpreateStatus: true,
        };
        this.takeChangeMusic(params); //操作vuex 改变播放状态
      }
      if (this.playMode === 1) {
        // 单曲循环
        this.currentTime = 0;
        this.$refs.maudio.currentTime = 0;
        this.playing = true;
        this.$refs.maudio.play();
      }
      if (this.playMode === 2) {
        // 随机播放
        // 把上一次播放过的过滤掉，以免随机到
        let List = this.GetPlayList.filter((item) => {
          return item.id !== this.willPlayMusicItem.id;
        });
        // 随机出index
        let randomIndex = Math.floor(Math.random() * (List.length - 2 - 0)) + 0;
        let params = {
          id: List[randomIndex].id,
          OpreateStatus: true,
        };
        this.takeChangeMusic(params); //操作vuex 改变播放状态
      }
    },
    //点击进度条
    progressClick(e) {
      // 有id代表有歌曲才可点击
      if (!this.id) {
        return;
      }
      let songTime =
        (this.willPlayMusicItem.musicInfo.size * 8) / this.willPlayMusicItem.musicInfo.br;

      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this.$refs.progress.style.width = offsetWidth;
      this.$refs.progressBtn.style.left = offsetWidth;
      this.percent = offsetWidth / rect.width;
      this.$refs.maudio.currentTime = songTime * this.percent; // 让audio播放组件知道现在歌曲在几秒
    },
    // 拖拽进度条
    // 按住 进度条圆形按钮事件
    processBtnDown(e) {
      // 有id代表有歌曲才可点击
      if (!this.id) {
        return;
      }
      /**
       * 给vue全局的this 改名为self 以免与 function中的 this混淆
       * 因为在 function中 使用 this 指向的是他自己也就是 $refs.progressBtn
       */
      let self = this;

      //getBoundingClientRect() 获取 dom的 高宽 x，y 方位值
      const processWidth = self.$refs.progressBarWrapper.getBoundingClientRect().width;

      let songTime =
        (self.willPlayMusicItem.musicInfo.size * 8) / self.willPlayMusicItem.musicInfo.br;

      self.$refs.progressBtn.onmousemove = function (e) {
        let thisBtn = this; // 给function作用域中的 this 改名为thisBtn 以免与 vue全局中的 this混淆

        // 拖拽时 暂停音乐 防止影响 拖拽效果
        self.$refs.maudio.pause();

        // 获取拖拽时的 进度条总宽rect 和 圆形按钮距离 左边的距离 offsetWidth
        const rect = self.$refs.progressBar.getBoundingClientRect();
        let offsetWidth = e.pageX - rect.left;

        // 控制 浮动的 按钮不超过进度条宽度
        if (offsetWidth > processWidth) {
          // 超过则 偏移量 等于进度条宽度
          offsetWidth = processWidth;
        }
        // 控制 浮动的 按钮不低于进度条
        if (offsetWidth < 0) {
          offsetWidth = 0;
        }

        // 拖拽时 把值赋给 按钮left 和进度条宽度
        self.$refs.progress.style.width = offsetWidth;
        thisBtn.style.left = offsetWidth;
        self.percent = offsetWidth / rect.width;
        self.$refs.maudio.currentTime = songTime * self.percent;
      };

      // 松开 按钮 onmousemove置为null
      self.$refs.progressBtn.onmouseup = function () {
        let thisBtn = this; // 给function作用域中的 this 改名为thisBtn 以免与 vue全局中的 this混淆

        // 松开鼠标重新开始 播放
        self.$refs.maudio.play();
        self.playing = true;

        thisBtn.onmousemove = thisBtn.onmouseup = null;
      };
      return false;
    },
    // 点击显示播放列表
    playListBtnClick() {
      this.showPlayList = !this.showPlayList;
    },
    // 请求歌曲url方法
    async getMusicUrlData(id) {
      const res = await indexReq.getMusicUrl({ id });
      this.URL = res.data.data[0].url;
    },
    // 点击歌曲封面展示 歌词页 和歌曲评论ye
    showSongDetail() {
      this.flag = !this.flag;
      this.$refs.songDetail.id = this.id;
      this.$refs.songDetail.songDetailFlag = !this.$refs.songDetail.songDetailFlag;
    },
    // 获取歌曲评论
    async getComments() {
      let limit = 30;
      try {
        const res = await getSongComments({ id: this.id, limit });
        this.allLits = res.data.comments;
        this.hotlist = res.data.hotComments;
        this.total = res.data.total;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取歌曲详情
    async getMusicDetails() {
      const res = await getMusicDetail({ ids: this.id });
      this.Alias = res.data.songs[0].al;
      this.Artists = res.data.songs[0].ar;
      this.MusicName = res.data.songs[0].name;
    },
    // 歌词
    async getMusicGeci() {
      const res = await getGeci({ id: this.id });
      this.Geci = res.data;
    },
    // 切换播放模式
    changeMode() {
      let modeNum = this.playMode + 1;
      this.playMode = modeNum % 3;
    },
    // 改变音量
    changeVolume() {},
    progressVolume(e) {
      // 有id代表有歌曲才可点击
      if (!this.id) {
        return;
      }
      const rect = this.$refs.volumeBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this.$refs.volume.style.width = offsetWidth;
      this.vBtnLeft = offsetWidth - 3;
      this.VoLpercent = offsetWidth / rect.width;
    },
    volumeBtnDown() {
      // 有id代表有歌曲才可点击
      if (!this.id) {
        return;
      }
      let self = this;
      //getBoundingClientRect() 获取 dom的 高宽 x，y 方位值
      const processWidth = self.$refs.volumeBarWrapper.getBoundingClientRect().width;
      self.$refs.volumeBtn.onmousemove = function (e) {
        let thisBtn = this;
        // 获取拖拽时的 进度条总宽rect 和 圆形按钮距离 左边的距离 offsetWidth
        const rect = self.$refs.volumeBar.getBoundingClientRect();
        let offsetWidth = e.pageX - rect.left;
        // 控制 浮动的 按钮不超过进度条宽度
        if (offsetWidth > processWidth) {
          // 超过则 偏移量 等于进度条宽度
          offsetWidth = processWidth;
        }
        // 控制 浮动的 按钮不低于进度条
        if (offsetWidth < 0) {
          offsetWidth = 0;
        }
        // 拖拽时 把值赋给 按钮left 和进度条宽度
        self.$refs.volume.style.width = offsetWidth;
        self.vBtnLeft = offsetWidth - 3;
        self.VoLpercent = offsetWidth / rect.width;
        // 松开 按钮 onmousemove置为null
        self.$refs.volumeBtn.onmouseup = function () {
          let thisBtn = this; // 给function作用域中的 this 改名为thisBtn 以免与 vue全局中的 this混淆
          thisBtn.onmousemove = thisBtn.onmouseup = null;
        };
      };
    },
  },
  watch: {
    //进度条变化
    percent(val) {
      let value = val * 100 + "%";
      this.$refs.progress.style.width = value;
      this.$refs.progressBtn.style.left = val * 100 + "%";
    },
    // 音量百分比
    VoLpercent(val) {
      let value = val * 100 + "%";
      this.$refs.volume.style.width = value;
      this.$refs.volumeBar.style.left = val * 100 + "%";
      // 给播放器设置音量
      this.$refs.maudio.volume = val * 1.0;
    },
    // 当前时间变化,时间变化说明有歌曲进来了，或者进度条被拖动
    currentTime(val) {
      let songTime =
        (this.willPlayMusicItem.musicInfo.size * 8) / this.willPlayMusicItem.musicInfo.br;
      let s = showNum(songTime % 60);
      let m = showNum((songTime / 60) % 60);
      this.totalDuration = m + ":" + s; // 获取总时间 几分几秒
      this.id = this.willPlayMusicItem.id;
      this.handle(val);
    },

    // 监听 传过来的 歌曲是否有变化，变化的话就把   this.playing = true 播放图标自动变为暂停图标
    willPlayMusicItem(val) {
      this.playing = true;
    },
    // id变化代表歌曲变了 重新请求 评论信息传给 歌曲详情组件
    id(val) {
      this.getComments();
      this.getMusicDetails();
      this.getMusicGeci();
    },
    playing(val) {
      this.$refs.songDetail.playStatus = this.playing;
    },
  },
  computed: {
    // 播放状态显示对应的图标
    ...mapGetters(["GetPlayList", "PlayListLength", "willPlayMusicItem"]),

    playImage() {
      return this.playing
        ? require("@/assets/images/stop.jpg")
        : require("@/assets/images/play.jpg");
    },

    willPlayMusicUrl() {
      // 如果vuex中存在将要播放的歌曲的url
      if (this.willPlayMusicItem.musicInfo.url) {
        // 直接返回url
        return this.willPlayMusicItem.musicInfo.url;
      } else {
        // 不存在 url 说明传进vuex的是一整个歌单，所以我们需要根据id重新请求一下这个url并返回给 播发器audio
        this.getMusicUrlData(this.willPlayMusicItem.id);

        return this.URL;
      }
    },
  },
  components: {
    xsPlaylist,
    songDetail,
  },
};
</script>

<style lang="less" scoped>
body {
  margin: 0;
  padding: 0;

  color: #c6c6c6;
}
#play {
  position: relative;
  border-top: 1px solid #dad5d5;
  background-color: #eee;
  height: 75px;
  display: flex;

  .music_info {
    width: 22%;
    display: flex;
    align-items: center;

    .music_info_Wrap {
      display: flex;
      align-items: center;
      .imgwrap:hover .hoverBCK {
        background-color: rgba(0, 0, 0, 0.3);
      }
      .hoverBCK {
        position: absolute;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 5px;
        width: 55px;
        height: 55px;
      }
      .imgwrap {
        border: 1px solid #eee;
        border-radius: 5px;
        margin: 10px;
        .music_avatar {
          cursor: pointer;
          border: 1px solid #eee;
          border-radius: 5px;
          width: 55px;
          height: 55px;
        }
      }

      .music_detail {
        .music_name {
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          width: 19vw;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
        .music_auther {
          cursor: normal;
          margin-top: 5px;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
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
  }

  .play_audio {
    width: 56%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .operators {
      position: relative;
      padding-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .mode {
        position: absolute;
        left: -50px;
        img {
          border: 1px solid #eee;
          border-radius: 13px;
          padding: 3px;
        }
      }
      .mode :hover {
        background-color: rgb(190, 189, 189);
      }
      .operators_icon {
        font-size: 20px;
        color: #000;
        cursor: pointer;
      }
      .playImage {
        margin: 0 10px;
        width: 30px;
        height: 30px;
      }
    }
    .process_cpns {
      display: flex;
      width: 70%;

      .currentDuration {
        position: relative;
        right: 22px;
        top: 3.5px;
        width: 28px;
        padding: 0;
        margin: 0;
      }
      .progress-bar-wrapper {
        flex: 4;

        width: 100%;
        height: 40px;
        background-color: #eee;
        .progress-bar {
          cursor: pointer;
          height: 100%;
          .bar-inner {
            position: relative;
            top: 13px;
            height: 4px;
            background: #fff;
            .progress {
              position: absolute;
              height: 100%;
              background-color: rgb(248, 45, 45); //bc99ff
            }
            .progress-btn-wrapper {
              position: absolute;
              left: -8px;
              top: -13px;
              width: 30px;
              height: 30px;
              .progress-btn {
                position: relative;
                top: 7px;
                left: -7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid #fff;
                border-radius: 50%;
                background: red; // bc99ff
              }
            }
          }
        }
      }
      .totalDuration {
        position: relative;
        width: 20px;

        left: 9px;
        top: 3.5px;
        padding: 0;
        margin: 0;
      }
    }
  }
  .play_tool {
    width: 22%;
    height: 80px;

    .play_tool_wrap {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      justify-content: space-around;
      align-items: center;
      .small_play_list {
        flex: 1;
        cursor: pointer;
        font-size: 25px;
        color: #000;
      }
      .loudly {
        flex: 3;
        display: flex;
        align-items: center;
        .progress-bar-wrapper {
          width: 80px;
          margin-top: 12px;
          margin-left: 15px;
          height: 40px;
          background-color: #eee;
          .progress-bar {
            height: 100%;
            .bar-inner {
              position: relative;
              top: 13px;
              height: 4px;
              background: #c6c6c6;
              .progress {
                position: absolute;
                height: 100%;
                background-color: rgb(248, 45, 45); //bc99ff
              }
              .volumeBtn {
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                .progress-btn {
                  position: relative;
                  top: 10px;
                  left: 2px;
                  box-sizing: border-box;
                  width: 8px;
                  height: 8px;

                  border-radius: 50%;
                  background: red; // bc99ff
                }
              }
            }
          }
        }
      }
    }
  }
}
.song_detail {
  position: absolute;
  transform: scale(0, 0);
  transition: 0.4s;
}
.song_detail_act {
  position: absolute;
  transition: 0.4s;
}
</style>
