<template>
  <div id="tags">
    <div class="tags_Wrap">
      <div class="big_tag" @click="BigClick">{{ currentTag }}></div>
      <!-- 父元素一定要判断一下 tagSmallList[0] 是否存在 -->
      <div class="small_tag" v-if="tagSmallList[0]">
        <div
          class="small_tag_wrap"
          v-for="tagSmall in tagSmallList"
          
          :key="tagSmall.name"
          @click="tagSmallClick(tagSmall.name)"
          :class="{ active: hasEqual(tagSmall.name) }"
        >
          {{ tagSmall.name }}
        </div>
      </div>
    </div>
    <div class="tag_table" v-if="isShow">
            
      <div class="all" @click="allClick" ><span :class="{ allActive: currentTag === '全部歌单' }">全部歌单</span></div>
      <table >
        <tr v-for="(item, index) in tableRow" :key="index" >
          <td
            v-for="(col) in tableRowTags(index)"
            :key="col.name"
            @click="colClick(col.name)"
            :class="{ active: hasEqual(col.name) }"
          >
            {{ col.name }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagsControl",
  data() {
    return {
      isShow: false,
      currentIndex: 0,
      currentTag: "华语",
      tableRow: [0, 1, 2, 3, 4],
    };
  },
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    //  计算属性 传参的话方法 两个 return
    tableRowTags() {
      return (i) => {
        return this.tags.filter((v) => v.category === i);
      };
    },
    tagSmallList() {
      let SmallTags = [];
      for (let i = 0; i < 10; i++) {
        SmallTags.push(this.tags[i]);
      }
      return SmallTags;
    },
    // 判断 当前 点击的tag是否和 列表中的name相等 实现点击一个列表 另一边列表样式也会改变
    hasEqual() {
      return (name) => {
        return this.currentTag === name;
      };
    },
  },
  methods: {
    // 点击显示 tag 表格
    BigClick() {
      this.isShow = !this.isShow;
    },
    // 全部歌单点击事件
    allClick() {
      this.currentTag = "全部歌单";
      this.isShow = !this.isShow;
      this.$emit('tagNameClick',this.currentTag);

    },
    // tag表格点击事件
    colClick(name) {
      this.currentTag = name;
      this.isShow = !this.isShow;
      this.$emit('tagNameClick',name);
    },
    // 小tag聊表点击事件
    tagSmallClick(name) {
      this.currentTag = name;
      if (this.isShow === true) {
        this.isShow = !this.isShow;
      }
      this.$emit('tagNameClick',name);
    },
  },
};
</script>

<style scoped>
#tags {
  margin-top: 10px;
  z-index: 999;
}
.tags_Wrap .big_tag {
  width: 110px;
  padding: 10px;
  border: 1px solid rgb(209, 204, 204);
  border-radius: 14.5px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.big_tag:hover {
  background-color: #f5f5f5;
}
.all{
  margin-bottom: 10px;
  border-bottom: 1px solid #eeee;
  padding: 20px 0;

}
.all span{
  padding: 5px 10px;
  margin-bottom: 10px;
  cursor: pointer;

  font-size: 14px;
}
.allActive {
  color: red;
  background-color: #f5f5f5;
  border-radius: 14.5px;
}
.tag_table{
  position: absolute;
  z-index: 999;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #eee;
  width: 1000px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #eee;
  margin-bottom: 20px;
}
table td {
  padding: 5px 5px;
  margin: 10px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}
.tags_Wrap {
  display: flex;
  height: 29px;
  justify-content: space-between;
  margin-bottom: 10px;

}

.tags_Wrap .small_tag {
  display: flex;
}
.small_tag_wrap {
  margin-right: 10px;
  font-size: 13px;
  padding: 0 10px;

  display: flex;
  align-items: center;
  justify-content: center;
}
.active {
  color: red;
  background-color: #f5f5f5;
  border-radius: 14.5px;
}
</style>
