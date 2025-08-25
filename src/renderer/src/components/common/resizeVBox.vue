<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-06-20 10:22:23
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="gl__resize_box" :class="$attrs.class">
    <div class="left">
      <div class="resize-bar" :style="{ '--chat-height': initResizeBoxWidth, '--chat-min-height': minHeight, '--chat-max-height': maxHeight }"></div>
      <div class="resize-line"></div>
      <div class="resize-box">
        <slot></slot>
      </div>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ResizeVBox',
  components: {},
  inheritAttrs: false,
  props: {
    initResizeBoxWidth: {
      type: String,
      default: '200px', //初始resizeBox的宽度，不支持百分比单位，后续有时间再支持一下
    },
    minHeight: {
      type: String,
      default: '20vh',
    },
    maxHeight: {
      type: String,
      default: '50vw',
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style scoped>
.gl__resize_box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .left {
    position: relative;
    .resize-bar {
      height: var(--chat-height);
      min-height: var(--chat-min-height);
      max-height: var(--chat-max-height);
      resize: vertical;
      opacity: 0;
      overflow: scroll;
      &:hover + .resize-line {
        border-top: 2px dashed skyblue;
      }
    }
    .resize-bar::-webkit-scrollbar {
      width: 9999px;
    }
    /* 拖拽线 */
    .resize-line {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      border-top: 1px solid #bbb;
      pointer-events: none;
    }
    .resize-box {
      position: absolute;
      top: 0;
      bottom: 5px;
      left: 0;
      right: 0;
    }
  }
  .right {
    overflow: hidden;
    flex: 1;
  }
}
</style>
