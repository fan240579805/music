<template>
  <div id="tab">
    <div class="tab_Wrap">
      <div class="item_wrap" v-for="(item, index) in titles" :key="item.name">
        <span
          class="item"
          :class="{ active: currentIndex === index }"
          @click="tabClick(index, item.path)"
          >{{ item.name }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab",
  data() {
    return {
      currentIndex: 0,
    };
  },
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    tabClick(index, namepath) {
      this.currentIndex = index;
      this.$emit("tabTitleItem", namepath);
      this.$router.push("/index" + namepath);
    },
  },
};
</script>

<style scoped>
#tab {
  width: 100vw;
  margin-left: 0.6vw;
  position: fixed;
  background-color: #fff;
  z-index: 999;
}
.tab_Wrap {
  width: 450px;
  display: flex;
  background-color: #fff;
  height: 49px;
  position: relative;
}
.tab_Wrap .item_wrap {
  flex: 1;
  display: inline-block; /**下边框与文字等长，给文字span 然后再给父元素添加 display:inline-block */
  height: 100%;
  text-align: center;
  line-height: 49px;
}
.tab_Wrap .item_wrap :hover {
  border-bottom: 3px solid red;
}
.tab_Wrap .item_wrap .active {
  font-size: 20px;
  color: #000;
  font-weight: 600;
  border-bottom: 3px solid red;
}
.tab_Wrap .item_wrap .item {
  height: 100%;
  font-size: 16px;
  padding: 5px;
  cursor: pointer;
  color: #000;
}

/**伪类实现短边框 父盒子需加上 position: relative*/
/* .active:after {
  content: "";
  position: absolute;
  left: 10%;
  top: auto;
  bottom: 0;
  right: auto;
  height: 6px;
  width: 105px;
  background-color: red;
} */
</style>
