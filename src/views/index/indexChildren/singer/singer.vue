<template>
  <div id="singer">
    <div class="tags">
      <div class="tags_wrap">
        <div style="padding: 10px">语种：</div>

        <div
          @click="langsClick(index)"
          class="item"
          :class="{ item_active: index === langsCurrentIndex }"
          v-for="(langTagsitem, index) in langTags"
          :key="index"
        >
          {{ langTagsitem.name }}
        </div>
      </div>
      <div class="tags_wrap">
        <div style="padding: 10px">分类：</div>
        <div
          @click="cateClick(index)"
          class="item"
          :class="{ item_active: index === cateCurrentIndex }"
          v-for="(cateTagsitem, index) in cateTags"
          :key="index"
        >
          {{ cateTagsitem.name }}
        </div>
      </div>
      <div class="tags_wrap">
        <div style="padding: 10px">筛选：</div>
        <div
          @click="initClick(index)"
          class="item"
          :class="{ item_active: index === initCurrentIndex }"
          v-for="(initTagsitem, index) in initTags"
          :key="index"
        >
          {{ initTagsitem.name }}
        </div>
      </div>
    </div>
    <div style="width: 90%">
      <a-row :gutter="16">
        <a-col
          v-for="(Singeritem, index) in singerList"
          :key="index"
          :md="{ span: 4, offset: 1 }"
          :lg="{ span: 3, offset: 1 }"
          style="margin-top: 10px"
          ><router-link
            class="avatar"
            :to="{ path: '/singer_detail', query: { id: Singeritem.id } }"
            ><img
              v-lazy="Singeritem.picUrl"
              alt=""
              style="width: 11vw; height: 11vw; border-radius: 0.5vw"
          /></router-link>
          <router-link
            :to="{ path: '/singer_detail', query: { id: Singeritem.id } }"
            class="name"
            style="text-decoration: none; color: #666"
            >{{ Singeritem.name }}</router-link
          >
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getSingerList } from "network/indexReq";
export default {
  name: "singer",
  data() {
    return {
      langTags: [
        { areaId: -1, name: "全部" },
        { areaId: 7, name: "华语" },
        { areaId: 96, name: "欧美" },
        { areaId: 8, name: "日本" },
        { areaId: 16, name: "韩国" },
        { areaId: 0, name: "其他" },
      ],
      cateTags: [
        { typeId: -1, name: "全部" },
        { typeId: 1, name: "男歌手" },
        { typeId: 2, name: "女歌手" },
        { typeId: 3, name: "乐队" },
      ],
      initTags: [
        { initSmall: -1, name: "热门" },
        { initSmall: "a", name: "A" },
        { initSmall: "b", name: "B" },
        { initSmall: "c", name: "C" },
        { initSmall: "d", name: "D" },
        { initSmall: "e", name: "E" },
        { initSmall: "f", name: "F" },
        { initSmall: "g", name: "G" },
        { initSmall: "h", name: "H" },
        { initSmall: "i", name: "I" },
        { initSmall: "j", name: "J" },
        { initSmall: "k", name: "K" },
        { initSmall: "l", name: "L" },
        { initSmall: "m", name: "M" },
        { initSmall: "n", name: "N" },
        { initSmall: "o", name: "O" },
        { initSmall: "p", name: "P" },
        { initSmall: "q", name: "Q" },
        { initSmall: "r", name: "R" },
        { initSmall: "s", name: "S" },
        { initSmall: "t", name: "T" },
        { initSmall: "u", name: "U" },
        { initSmall: "v", name: "V" },
        { initSmall: "w", name: "W" },
        { initSmall: "x", name: "S" },
        { initSmall: "y", name: "Y" },
        { initSmall: "z", name: "Z" },
        { initSmall: 0, name: "#" },
      ],
      singerList: [], // 歌手列表
      langsCurrentIndex: 0, //当前点击 tag 的index
      cateCurrentIndex: 0, //当前点击 tag 的index
      initCurrentIndex: 0, //当前点击 tag 的index
    };
  },
  created() {
    this.getSingers();
  },
  methods: {
    async getSingers(type, area, initial) {
      const res = await getSingerList({ type, area, initial });
      this.singerList = res.data.artists;
    },
    langsClick(index) {
      this.langsCurrentIndex = index;
      this.getSingers(
        this.cateTags[this.cateCurrentIndex].typeId,
        this.langTags[this.langsCurrentIndex].areaId,
        this.initTags[this.initCurrentIndex].initSmall
      );
    },
    cateClick(index) {
      this.cateCurrentIndex = index;
      this.getSingers(
        this.cateTags[this.cateCurrentIndex].typeId,
        this.langTags[this.langsCurrentIndex].areaId,
        this.initTags[this.initCurrentIndex].initSmall
      );
    },
    initClick(index) {
      this.initCurrentIndex = index;
      this.getSingers(
        this.cateTags[this.cateCurrentIndex].typeId,
        this.langTags[this.langsCurrentIndex].areaId,
        this.initTags[this.initCurrentIndex].initSmall
      );
    },
  },
};
</script>

<style lang="less" scoped>
#singer {
  padding-top: 49px;
  .tags {
    margin-left: 35px;
    width: 70%;
    word-wrap: break-word;
    word-break: normal;
    .tags_wrap {
      display: flex;
      flex-wrap: wrap;
      .item {
        font-size: 13px;
        cursor: pointer;
        position: relative;

        margin: 9px 5px;
        padding: 1px 15px;
      }
      .item:hover {
        color: #333;
      }
      .item_active {
        background-color: #f5f5f5;
        color: red;
        border-radius: 11.4px;
      }
      .item:after {
        content: "";
        position: absolute;
        right: -9%;
        top: 5px;
        height: 12px;
        width: 0.5px;
        background-color: rgb(216, 210, 210);
      }
    }
  }
}
</style>
