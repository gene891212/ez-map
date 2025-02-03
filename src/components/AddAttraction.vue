<template>
  <div style="padding: 0 20px;">
    <el-header style="text-align: center;">
      <h1>新增景點</h1>
    </el-header>
    <AttractionForm :attraction="newAttraction" @submit="handleAddAttraction" @reset="resetForm" />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ref as dbRef, push } from "firebase/database";
import { useRouter } from "vue-router";
import { database } from "@/firebase";
import { ElMessage } from "element-plus";
import AttractionForm from "@/components/AttractionForm.vue";
import Attraction from "@/models/Attraction";
import FieldExample from "@/models/FieldExample";

const router = useRouter();

const newAttraction = ref(
  new Attraction(
    "",
    "",
    "",
    "",
    [
      new FieldExample(0, "景點名稱", "", null),
      new FieldExample(1, "地址", "", null),
      new FieldExample(2, "營業時間", "", null),
      new FieldExample(3, "電話", "", null),
      new FieldExample(4, "網站", "", null),
    ]
  ).toObject()
);

// 新增景點數據
const handleAddAttraction = async () => {
  console.log("New attraction:", newAttraction.value);
  try {
    const attractionsRef = dbRef(database, "attractions");
    const newAttractionRef = await push(attractionsRef, newAttraction.value);
    ElMessage({
      message: "景點新增成功！",
      type: "success",
    });
    router.push({ name: "EditAttraction", params: { id: newAttractionRef.key } });
  } catch (error) {
    console.error("Error adding attraction:", error);
    ElMessage({
      message: "新增失敗，請稍後重試",
      type: "error",
    });
  }
};

// 重置表單
const resetForm = () => {
  formRef.value.resetFields();
};
</script>
