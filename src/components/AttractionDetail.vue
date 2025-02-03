<template>
  <el-header>
    <h1 class="text-center">景點詳情</h1>
  </el-header>
  <el-main>
    <!-- 返回按鈕 -->
    <el-button type="primary" @click="goBack" style="margin-bottom: 20px;">
      返回列表
    </el-button>

    <!-- 加載狀態 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-card shadow="hover">
          <p><strong>名稱：</strong>加載中...</p>
          <p><strong>地址：</strong>加載中...</p>
          <p><strong>介紹：</strong>加載中...</p>
          <p><strong>交通資訊：</strong>加載中...</p>
          <p><strong>營業時間：</strong>加載中...</p>
          <p><strong>購票資訊：</strong>加載中...</p>
          <p><strong>網站：</strong>加載中...</p>
        </el-card>
      </template>
      <template #default>
        <!-- 景點詳細資訊 -->
        <el-card shadow="hover" v-if="attraction">
          <div style="text-align: center; margin-bottom: 20px;">
            <img :src="attraction.image" alt="景點圖片" style="max-width: 100%; height: auto;" />
          </div>
          <p><strong>名稱：</strong>{{ attraction.name }}</p>
          <p><strong>地址：</strong>{{ attraction.address }}</p>
          <p><strong>介紹：</strong>{{ attraction.description }}</p>
          <p><strong>交通資訊：</strong>{{ attraction.transport }}</p>
          <p><strong>營業時間：</strong>{{ attraction.hours }}</p>
          <p><strong>購票資訊：</strong>{{ attraction.ticket }}</p>
          <p>
            <strong>網站：</strong>
            <el-link :href="attraction.website" target="_blank">{{ attraction.website }}</el-link>
          </p>
        </el-card>
      </template>
    </el-skeleton>

    <!-- 錯誤處理 -->
    <div v-if="error" class="error-state">
      <p>無法加載景點詳情，請稍後重試。</p>
      <router-link to="/">
        <el-button type="danger">返回列表</el-button>
      </router-link>
    </div>
  </el-main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { database } from "@/firebase";
import { ref as firebaseRef, onValue, off } from "firebase/database";

// 初始化
const route = useRoute();
const router = useRouter();
const attraction = ref(null);
const loading = ref(true);
const error = ref(false);

// 返回到上一頁
const goBack = () => {
  router.push("/");
};

// 取得景點ID
const id = route.params.id;

// 監聽 Firebase 資料
onMounted(() => {
  const dbRef = firebaseRef(database, `attractions/${id}`);
  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      attraction.value = snapshot.val();
      loading.value = false;
    },
    (err) => {
      console.error(err);
      error.value = true;
      loading.value = false;
    }
  );

  // 清理監聽
  return () => {
    off(dbRef);
  };
});
</script>

<style>
.text-center {
  text-align: center;
}

.mt-5 {
  margin-top: 20px;
}

.error-state {
  text-align: center;
  color: #ff4d4f;
  margin-top: 20px;
}
</style>
