<template>
  <el-container style="height: 100vh;">
    <!-- 側邊欄 -->
    <el-aside width="300px"
      style="background: #f2f2f2; padding: 10px; display: flex; flex-direction: column; height: 100vh;">
      <el-row justify="space-between" align="middle">
        <h3>已選景點</h3>
        <el-upload :show-file-list="false" accept=".json" :auto-upload="false" :on-change="handleFileUpload">
          <el-button :icon="Plus">匯入</el-button>
        </el-upload>
        <el-button type="primary" @click="goToAddAttraction">
          新增景點
        </el-button>
      </el-row>

      <!-- 搜尋欄 -->
      <!-- BUG: selected attractions will be clear when search -->
      <el-input v-model="searchQuery" placeholder="搜尋景點" clearable :prefix-icon="Search" style="margin-bottom: 10px;" />

      <!-- 讓 table 內部滾動，header 固定 -->
      <el-table ref="tableRef" :data="filteredAttractions" border style="width: 100%;" height="calc(100vh - 160px)"
        @cell-click="goToDetail" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="name" label="名稱" />
      </el-table>

      <!-- 下方按鈕 -->
      <el-row justify="space-between" style="padding-top: 10px;">
        <el-button type="default" @click="exportSelectedAttractions">
          儲存選擇景點
        </el-button>
        <el-button type="primary" @click="goToSelectedView">
          輸出景點PDF
        </el-button>
      </el-row>
    </el-aside>

    <!-- 主內容區域 -->
    <el-main>
      <el-menu mode="horizontal">
        <el-menu-item index="1"><router-link to="/">首頁</router-link></el-menu-item>
        <el-menu-item index="2" v-if="!user"><router-link to="/login">登入</router-link></el-menu-item>
        <el-menu-item index="3" v-if="!user"><router-link to="/register">註冊</router-link></el-menu-item>
        <el-menu-item index="4" v-if="user" @click="logout">登出</el-menu-item>
      </el-menu>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, onMounted, nextTick } from "vue";
import { ref as firebaseRef, onValue } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

import { useAttractionStore } from "@/stores/attractionStore";
import { database, auth } from "@/firebase";
import { Plus, Search } from "@element-plus/icons-vue";

const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

// 使用路由
const router = useRouter();

// 使用 Pinia Store
const attractionStore = useAttractionStore();
const { selectedAttractions } = storeToRefs(attractionStore);

const tableRef = ref(null);
const attractions = ref({});
const searchQuery = ref("");

// 監聽 Firebase 資料變更
const dbRef = firebaseRef(database, "attractions");
onValue(dbRef, (snapshot) => {
  attractions.value = snapshot.val() || {};
});

// 多選事件，更新 Pinia Store
const handleSelectionChange = (selectedRows) => {
  attractionStore.updateSelectedAttractions(selectedRows);
};

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

const handleFileUpload = async (file) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (!Array.isArray(importedData)) {
        console.error("匯入的 JSON 格式錯誤，應為 ID 陣列");
        return;
      }
      // magic here again
      await nextTick();

      if (tableRef.value) {
        tableRef.value.clearSelection();

        importedData.forEach((id) => {
          const row = filteredAttractions.value.find(item => item.id === id);
          if (row) {
            tableRef.value.toggleRowSelection(row, true);
          }
        });
      }

    } catch (error) {
      console.error("匯入 JSON 失敗:", error);
    }
  };
  reader.readAsText(file.raw);
};


const exportSelectedAttractions = () => {
  const selectedAttractionsArray = selectedAttractions.value.map((attraction) => {
    const { id, ...rest } = attraction;
    return id;
  });

  const data = JSON.stringify(selectedAttractionsArray, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // download
  const a = document.createElement("a");
  a.href = url;
  const dateStr = new Date().toISOString().replace(/:/g, '-');
  a.download = `attractions-${dateStr}.json`;
  console.log(a.download);
  a.click();
};

// 跳轉到已選景點頁面
const goToSelectedView = () => { router.push({ name: "SelectedAttractions" }) };
const goToAddAttraction = () => { router.push({ name: "AddAttraction" }) };

// 跳轉到詳情頁
const goToDetail = (row, col) => {
  console.log(row, col)
  if (col.getColumnIndex() === 0) {
    return; // 防止點擊多選框觸發跳轉
  }
  router.push({ name: "EditAttraction", params: { id: row.id } });
};

const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    router.push({ name: "Login" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
// watch(filteredAttractions, async (newData) => {
//   // magic here
//   await nextTick();
//   if (tableRef.value) {
//     console.log("filteredAttractions changed", selectedAttractions.value);

//     // 根據 store 中的選擇來更新 table 的勾選狀態
//     selectedAttractions.value.forEach((selectedItem) => {
//       const row = newData.find(item => item.id === selectedItem.id);
//       if (row) {
//         tableRef.value.toggleRowSelection(row, true);
//       }
//     });
//   }
// }, { immediate: true });
</script>
