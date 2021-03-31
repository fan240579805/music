<template>
  <div id="listSlot">
    <div class="list_wrap">
      <div class="list_title">
        <div class="begin_title_wrap"><slot name="title_begin"></slot></div>
        <div class="second_title_wrap"><slot name="title_second"></slot></div>
        <div class="third_title_wrap"><slot name="title_third"></slot></div>
        <div class="forth_title_wrap"><slot name="title_forth"></slot></div>
        <div class="fifth_title_wrap"><slot name="title_fifth"></slot></div>
        <div class="end_title_wrap"><slot name="title_end"></slot></div>
      </div>
      <!-- v-for="(rankListItem) in rankList" :key="rankListItem.name" -->
      <div class="list_item">
        <div class="begin_wrap"><slot name="begin"></slot></div>
        <div class="second_wrap"><slot name="second"></slot></div>
        <div class="third_wrap"><slot name="third"></slot></div>
        <div class="forth_wrap"><slot name="forth"></slot></div>
        <div class="fifth_wrap"><slot name="fifth"></slot></div>
        <div class="end_wrap"><slot name="end"></slot></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "slotList",
  created() {},
  mounted() {},
  props: {},
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
#listSlot {
  .list_wrap {
    .list_title {
      display: flex;
      font-size: 16px;

      .begin_title_wrap {
        flex: 0.5;
        display: flex;
        align-items: center;
      }
      .second_title_wrap {
        flex: 0.5;
        display: flex;
        align-items: center;
      }
      .third_title_wrap {
        flex: 4;
        display: flex;
        align-items: center;
      }
      .forth_title_wrap {
        flex: 3;
        display: flex;
        align-items: center;
      }
      .fifth_title_wrap {
        flex: 3;
        display: flex;
        align-items: center;
      }
      .end_title_wrap {
        flex: 2;
        display: flex;
        align-items: center;
      }
    }

    .list_item:hover {
      background-color: #e9e9e9;
    }
    .list_item {
      display: flex;

      .begin_wrap {
        flex: 0.5;
        color: #8a8787;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .second_wrap {
        flex: 0.5;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .third_wrap {
        flex: 4;
        display: flex;
        align-items: center;
        padding-right: 1%;
      }
      .forth_wrap {
        flex: 3;
        display: flex;
        align-items: center;
      }
      .fifth_wrap {
        flex: 3;
        display: flex;
        align-items: center;
      }
      .end_wrap {
        flex: 2;
        // width: 100px;
        display: flex;
        align-items: center;
        // justify-content: flex-end;
        // // flex-direction: row-reverse;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        // word-break: break-all;
        // padding-right: 1%;
        // // overflow: hidden;
      }
    }
  }
}
</style>
