<!--
 * @Description:
 * @Author: zby
 * @Date: 2022-09-27 10:57:44
 * @LastEditors: zby
 * @Reference:
-->
<template>
  <div class="page_control">
    <i :title="$t('Lang_commonVariables.minimize')" class="vxe-icon-minus" @click="toMin"></i>
    <i v-show="isMaximized" :title="$t('Lang_commonVariables.restore')" class="vxe-icon-maximize" @click="toMax"></i>
    <i v-show="!isMaximized" :title="$t('Lang_commonVariables.maximize')" class="vxe-icon-square" @click="toMax"></i>
    <i :title="$t('Lang_commonVariables.close')" class="vxe-icon-close" @click="toClose"></i>
  </div>
</template>
<script>
import { mapState } from 'pinia';
import { useAppStore } from '@/stores/modules/app';
export default {
  name: 'WindowControl',
  components: {},
  props: {},
  data() {
    return {
      isMaximized: false,
    };
  },
  computed: {
    ...mapState(useAppStore, ['thisBrowserId']),
  },
  watch: {},
  async created() {
    this.getIsMaximized();
  },
  methods: {
    toMin() {
      window.electronAPI.ipcRenderer.invoke('callNativeMethodOfWindow', { browserWindowId: this.thisBrowserId, attr: 'minimize' });
    },
    async toMax() {
      if (this.isMaximized)
        await window.electronAPI.ipcRenderer.invoke('callNativeMethodOfWindow', { browserWindowId: this.thisBrowserId, attr: 'unmaximize' });
      if (!this.isMaximized)
        await window.electronAPI.ipcRenderer.invoke('callNativeMethodOfWindow', { browserWindowId: this.thisBrowserId, attr: 'maximize' });
      this.getIsMaximized();
    },
    toClose() {
      window.electronAPI.ipcRenderer.send('closeThisWin', { browserWindowId: this.thisBrowserId });
    },
    async getIsMaximized() {
      const isMaximized = await window.electronAPI.ipcRenderer.invoke('callNativeMethodOfWindow', {
        browserWindowId: this.thisBrowserId,
        attr: 'isMaximized',
      });
      this.isMaximized = isMaximized;
    },
  },
};
</script>
<style lang="scss" scoped>
.page_control {
  display: flex;
  align-items: center;
  i {
    font-size: 16px;
    color: $mainTextColor2;
    cursor: pointer;
    &:hover {
      color: $mainTextColor;
    }
  }
  i + i {
    margin-left: 20px;
  }
}
</style>
