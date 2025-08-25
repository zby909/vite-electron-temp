<!--
 * @Description:
 * @Author: zby
 * @Date: 2022-03-10 17:57:35
 * @FilePath: \tfl-client\src\views\error-page\401.vue
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back"> 返回 </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
        <h6>如有疑问请联系你领导</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <a href="https://www.taobao.com/" target="_blank">随便看看</a>
          </li>
          <li><a href="#" @click.prevent="dialogVisible = true">点我看图</a></li>
        </ul>
        gif来源<a target="_blank"> airbnb </a>页面
      </el-col>
      <el-col :span="12">
        <img src="https://pmf.q2janus.com/static/img/401.089007e7.gif?1640941352608" width="313" height="428" alt="Girl has dropped her ice cream." />
        <!-- <img src="@/assets/401_images/401.gif" width="313" height="428" alt="Girl has dropped her ice cream." /> -->
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="随便看">
      <img :src="ewizardClap" class="pan-img" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const ewizardClap = ref('https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646');
const dialogVisible = ref(false);

function back() {
  if (route.query.noGoBack) {
    router.push({ path: '/' });
  } else {
    router.go(-1);
  }
}
</script>

<style scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
}
.errPage-container .pan-back-btn {
  background: #008489;
  color: #fff;
  border: none !important;
}
.errPage-container .pan-gif {
  margin: 0 auto;
  display: block;
}
.errPage-container .pan-img {
  display: block;
  margin: 0 auto;
  width: 100%;
}
.errPage-container .text-jumbo {
  font-size: 60px;
  font-weight: 700;
  color: #484848;
}
.errPage-container .list-unstyled {
  font-size: 14px;
}
.errPage-container .list-unstyled li {
  padding-bottom: 5px;
}
.errPage-container .list-unstyled a {
  color: #008489;
  text-decoration: none;
}
.errPage-container .list-unstyled a:hover {
  text-decoration: underline;
}
</style>
