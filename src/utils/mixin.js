// 格式化歌手名字(在歌手名字后面加上/) 混入
export const nameArrayFormatMixin = {
  methods: {
    formatName(artists, name) {
      // 如果artists length === 1 说明 只有一个歌手 返回false 不加 /
      if (artists.length === 1) {
        return false;
      } else if (artists.findIndex((v) => v.name === name) === artists.length - 1) {
        /** 不止一个歌手
         * artists.findIndex((v) => v.name === name) === artists.length - 1
         * 先在artists 中找到 当前循环到的歌手 的index索引 然后再判断 该index是否和artists.length - 1 相等
         * 如果相等 则说明 循环到了该歌曲的最后一个 歌手，最后一个歌手后面不加 / return false
         */
        return false;
      } else {
        return true;
      }
    }
  },
}
/**
 * 播放全部歌曲方法
 * 点击歌单中心的 黑色播放按钮 将榜单中所有的歌曲 加进列表（vuex）中
 * 
 * 
 */

import { mapActions } from 'vuex';
export const playAllMusicListMixin = {
  ...mapActions(["AddAllRankMusicList"]),
  data() {
    return {
      musicItemArray: [],// 歌单数组
      musicList:[],//榜单中 所有歌曲
    }
  },
  methods: {
    AddAllMusic() {
      // 遍历榜单中 所有歌曲
      this.musicList.forEach((music) => {
        // 构造vuex 中的musicItem
        let musicItem = {
          id: music.id,
          musicInfo: {
            br: music.m ? music.m.br : music.l.br, // 三元表达式判断一下那个 对象存在
            size: music.m ? music.m.size : music.l.size,
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
}

