import { defineStore } from "pinia";

export const useAttractionStore = defineStore("attractionStore", {
  state: () => ({
    selectedAttractions: [], // 已選景點
  }),
  actions: {
    // 更新選中的景點
    updateSelectedAttractions(selectedRows) {
      this.selectedAttractions = selectedRows;
      console.log("已選景點", this.selectedAttractions);
    },
  },
});
