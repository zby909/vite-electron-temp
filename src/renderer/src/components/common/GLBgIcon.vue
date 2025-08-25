<!--
 * @Description:
 * @Author: zby
 * @Date: 2023-08-31 11:27:48
 * @LastEditors: zby
 * @Reference:
-->
<!--
描述：将图片以背景显示 by: zby
使用说明：
<BackgroundImg :img="'图片路径'" :size="类型，可选cover / contain"/> 外部定义类名设置宽高即可显示
-->
<template>
  <div class="gl-bgicon" :style="{ '--bgwidth': bgwidth, '--bgheight': bgheight }">
    <div
      class="gl-bgicon__bg"
      :class="[size, { hover: hoverImgsrc }]"
      :style="{ '--bgImg': 'url(' + imgsrc + ')', '--hoverBgImg': 'url(' + hoverImgsrc + ')' }"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GLBgIcon',
  props: {
    img: {
      type: [String, Promise],
      required: true,
    },
    hoverImg: {
      type: [String, Promise],
      required: false,
    },
    size: {
      type: String,
      validator(value: string) {
        return ['contain', 'cover'].includes(value);
      },
      default: 'contain',
    },
    bgwidth: {
      type: String,
      default: '10px',
    },
    bgheight: {
      type: String,
      default: '10px',
    },
  },
  data() {
    return {
      imgsrc: '',
      hoverImgsrc: '',
    };
  },
  async created() {
    this.getImgSrc(this.img).then(res => {
      console.log('getImgSrc', res);
      this.imgsrc = res;
    });
    this.getImgSrc(this.hoverImg).then(res => {
      this.hoverImgsrc = res;
    });
  },
  methods: {
    async getImgSrc(imgCon) {
      if (imgCon instanceof Promise) {
        const r = await imgCon;
        console.log(r);
        return r.default;
      } else {
        return imgCon;
      }
    },
  },
};
</script>

<style scoped>
.gl-bgicon {
  display: inline-block;
  width: var(--bgwidth);
  height: var(--bgheight);
}
.gl-bgicon .gl-bgicon__bg {
  display: block;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: var(--bgImg);
}
.gl-bgicon .gl-bgicon__bg.cover {
  background-size: cover;
}
.gl-bgicon .gl-bgicon__bg.hover:hover {
  background-image: var(--hoverBgImg);
}
</style>
