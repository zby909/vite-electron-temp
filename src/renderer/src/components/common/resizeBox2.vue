<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-06-20 10:22:23
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="gl__resize_box" :class="$attrs.class">
    <div v-if="!hideLeft" class="left">
      <div class="resize-bar" :style="{ '--chat-width': initResizeBoxWidth, '--chat-min-width': minWidth, '--chat-max-width': maxWidth }"></div>
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
<script>
export default {
  name: 'ResizeBox2',
  components: {},
  inheritAttrs: false,
  props: {
    initResizeBoxWidth: {
      type: String,
      default: '200px', //初始resizeBox的宽度，不支持百分比单位，后续有时间再支持一下
    },
    minWidth: {
      type: String,
      default: '20vw',
    },
    maxWidth: {
      type: String,
      default: '50vw',
    },
    hideLeft: {
      type: Boolean,
      default: false,
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
<style lang="scss" scoped>
.gl__resize_box {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .left {
    position: relative;
    .resize-bar {
      width: var(--chat-width);
      min-width: var(--chat-min-width);
      max-width: var(--chat-max-width);
      resize: horizontal;
      opacity: 0;
      overflow: scroll;
      &:hover + .resize-line {
        border-left: 2px dashed skyblue;
      }
    }
    .resize-bar::-webkit-scrollbar {
      height: 9999px;
    }
    /* 拖拽线 */
    .resize-line {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      border-left: 1px solid #ddd;
      pointer-events: none;
    }
    .resize-box {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 5px;
      overflow: hidden; //解决收起时元素溢出问题
    }
  }
  .right {
    overflow: hidden;
    flex: 1;
  }
}
</style>
