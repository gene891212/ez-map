<template>
  <el-header>
    <h1 class="text-center">景點列表</h1>
  </el-header>
  <el-main>
    <!-- 搜尋欄 -->
    <el-input
      v-model="searchQuery"
      placeholder="搜尋景點"
      clearable
      prefix-icon="el-icon-search"
      style="margin-bottom: 20px;"
    />

    <!-- 景點列表 -->
    <el-table
      ref="tableRef"
      :data="filteredAttractions"
      border
      style="width: 100%; cursor: pointer;"
      @cell-click="goToDetail"
      @selection-change="handleSelectionChange"
    >
      <!-- 多選框 -->
      <el-table-column type="selection" width="50"></el-table-column>

      <!-- 名稱欄位 -->
      <el-table-column prop="name" label="名稱" width="200" />

      <!-- 地址欄位 -->
      <el-table-column prop="address" label="地址" />
    </el-table>

    <!-- 無資料時顯示提示 -->
    <div v-if="filteredAttractions.length === 0" class="empty-state">
      暫無符合條件的景點資料
    </div>
  </el-main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAttractionStore } from "@/stores/attractionStore";
import { database } from "@/firebase";
import { ref as firebaseRef, onValue } from "firebase/database";

// 路由實例
const router = useRouter();

// Pinia Store
const attractionStore = useAttractionStore();

// 景點資料
const attractions = ref({});
const searchQuery = ref("");
const tableRef = ref(null); // 用於操作 ElTable 的引用

// 將景點資料轉換為陣列形式
const attractionsArray = computed(() => {
  return Object.entries(attractions.value).map(([id, attraction]) => ({
    id,
    ...attraction,
  }));
});

// 根據搜尋條件過濾景點
const filteredAttractions = computed(() => {
  if (!searchQuery.value) return attractionsArray.value;
  const query = searchQuery.value.toLowerCase();
  return attractionsArray.value.filter((attraction) =>
    attraction.name.toLowerCase().includes(query)
  );
});

// 監聽 Firebase 資料變更
const dbRef = firebaseRef(database, "attractions");
onValue(dbRef, (snapshot) => {
  attractions.value = snapshot.val() || {};
});

// 跳轉到詳情頁
const goToDetail = (row, col) => {
  console.log(row, col);
  if (col.getColumnIndex() === 0) {
    return; // 防止點擊多選框觸發跳轉
  }
  router.push({ name: "AttractionDetail", params: { id: row.id } });
};

// 多選事件，更新 Pinia Store
const handleSelectionChange = (selectedRows) => {
  attractionStore.updateSelectedAttractions(selectedRows);
};

// 初始化多選框狀態
const syncSelectedRows = () => {
  if (tableRef.value) {
    const preselectedRows = attractionStore.selectedAttractions.map((selected) =>
      filteredAttractions.value.find((item) => item.id === selected.id)
    ).filter(Boolean);
    tableRef.value.clearSelection(); // 清除所有選中項
    preselectedRows.forEach((row) => {
      tableRef.value.toggleRowSelection(row, true); // 手動選中行
    });
  }
};

// 當頁面掛載時同步多選框
onMounted(() => {
  syncSelectedRows();
});
</script>

<style>
.text-center {
  text-align: center;
}

.empty-state {
  text-align: center;
  color: #999;
  margin-top: 20px;
  font-size: 16px;
}
</style>
