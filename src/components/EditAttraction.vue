<template>
  <div style="padding: 0 20px; ">
    <el-header style="text-align: center;">
      <h1>編輯景點</h1>
    </el-header>
    <AttractionForm :attraction="attraction" @submit="updateAttraction" @reset="fetchAttraction" />
  </div>
</template>

<script setup>
import AttractionForm from "@/components/AttractionForm.vue";
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { database } from "@/firebase";
import { ref as dbRef, get, update, push, set } from "firebase/database";
import { ElMessage } from "element-plus";
import Attraction from "@/models/Attraction";
import FieldExample from "@/models/FieldExample";

const route = useRoute();
const attraction = ref(null); // 初始化為 null
const changeCount = ref(0);

const fetchAttraction = async () => {
  try {
    const snapshot = await get(dbRef(database, `attractions/${route.params.id}`));
    if (snapshot.exists()) {
      console.log("Attraction data:", snapshot.val());
      const data = snapshot.val();

      // 將資料轉換為 Attraction 實例
      const fields = data.fields.map(
        (field) =>
          new FieldExample(
            field.index,
            field.name,
            field.value,
            field.image || null
          )
      );

      attraction.value = new Attraction(
        data.name,
        data.address,
        data.backgroundImage || null,
        data.coverImage || null,
        fields
      );
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching attraction:", error);
  }
};

const updateAttraction = async () => {
  try {
    if (attraction.value) {
      const attractionRef = dbRef(database, `attractions/${route.params.id}`);
      await update(attractionRef, attraction.value.toObject());
      console.log("Attraction updated successfully");
      ElMessage({
        message: "景點更新成功！",
        type: "success",
      });
    }
  } catch (error) {
    console.error("Error updating attraction:", error);
  }
};

watch(() => route.params.id, fetchAttraction, { immediate: true });
</script>
