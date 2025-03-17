/*
 * @Description:
 * @Author: zby
 * @Date: 2023-05-26 16:44:40
 * @LastEditors: zby
 * @Reference:
 */
// Pinia Store
import { defineStore } from 'pinia';
import { pinia } from '@/stores/index';

export const useWinStore = defineStore({
  id: 'win',
  state: () => ({
    targetWinId: '',
    adminWinId: '',
  }),
  actions: {
    UPDATA_TARGETWINID(val) {
      this.targetWinId = val;
    },
    UPDATA_ADMINWINID(val) {
      this.adminWinId = val;
    },
  },
});

// Need to be used outside the setup
export function useWinStoreWithOut() {
  return useWinStore(pinia);
}
