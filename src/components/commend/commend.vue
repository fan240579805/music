<template>
  <div id="comments">
    <div class="comments_wrap">
      <h3 style="font-weight: 600">评论({{ propstotal }})</h3>
      <div class="input">
        <a-comment style="padding: 0">
          <div slot="content">
            <a-form-item>
              <a-textarea style="margin: 0" :rows="4" placeholder="输入" />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" type="wranning"> 发表评论 </a-button>
            </a-form-item>
          </div>
        </a-comment>
      </div>
      <h3 style="font-weight: 600">精彩评论</h3>
      <ul class="comment_list">
        <ol
          class="comment_list_item"
          v-for="CommentItem in cmpHotList"
          :key="CommentItem.commentId"
        >
          <div class="avatar"><img :src="CommentItem.user.avatarUrl" alt="" /></div>
          <div class="content">
            <div class="con">
              <span class="user"> {{ CommentItem.user.nickname }} : </span>
              <span>{{ CommentItem.content }}</span>
            </div>
            <div class="time">
              <span>{{ CommentItem.time | JINGqueformatDate }}</span>
              <span class="tool"> <a-icon type="like" /></span>
            </div>
          </div>
        </ol>
      </ul>
      <h4 style="font-weight: 600">所有评论</h4>
      <ul class="comment_list">
        <ol
          class="comment_list_item"
          v-for="CommentItemAll in cmpAllList"
          :key="CommentItemAll.commentId"
        >
          <div class="avatar"><img :src="CommentItemAll.user.avatarUrl" alt="" /></div>
          <div class="content">
            <div class="con">
              <span class="user"> {{ CommentItemAll.user.nickname }} : </span>
              <span>{{ CommentItemAll.content }}</span>
            </div>
            <div class="time">
              <span>{{ CommentItemAll.time | JINGqueformatDate }}</span>
              <span class="tool"> <a-icon type="like" /></span>
            </div>
          </div>
        </ol>
      </ul>
    </div>
  </div>
</template>

<script>
import { JINGqueformatDate } from "utils/common.js";
export default {
  name: "comments",
  data() {
    return {
      hotComments: [],
      allComments: [],
    };
  },
  // 从父组件接收过来的 props 的数组 需要进行 $set赋值才能是响应式的
  // 否则 父组件动态请求数据
  mounted() {},
  props: {
    propstotal: {
      type: Number,
      default: 0,
    },
    propsHotComments: {
      type: Array,
      default() {
        return [];
      },
    },
    propsAllComments: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    cmpHotList() {
      return this.propsHotComments;
    },
    cmpAllList() {
      return this.propsAllComments;
    },
  },
  filters: {
    JINGqueformatDate,
  },
};
</script>

<style lang="less" scoped>
#comments {
  margin-top: 20px;
  .comments_wrap {
    .comment_list {
      padding: 0;
      .comment_list_item {
        padding: 18px 0;
        display: flex;
        border-bottom: 1px solid rgb(233, 229, 229);
        .avatar {
          margin-right: 10px;
          img {
            border-radius: 20px;
            border: 1px solid #eee;
            width: 40px;
            height: 40px;
          }
        }
        .content {
          width: 100%;
          font-size: 13px;
          .con {
            .user {
              color: rgb(148, 156, 219);
              margin-right: 5px;
            }
          }
          .time {
            .tool {
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>
