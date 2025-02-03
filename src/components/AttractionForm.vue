<template>
  <template v-if="attraction">
    <el-form :model="attraction" :rules="rules" ref="formRef" label-width="120px">
      <template v-for="field in requiredFields">
        <el-form-item :label="field.label" :prop="field.prop">
          <el-input type="text" v-model="attraction[field.prop]" :placeholder="field.placeholder" />
        </el-form-item>
      </template>

      <template v-for="(field, index) in attraction.fields">
        <el-form-item>
          <template #label>
            <el-input v-model="field.name" placeholder="欄位名稱" />
          </template>
          <el-input type="text" v-model="field.value" :placeholder="field.placeholder" />
        </el-form-item>
        <el-form-item>
          <el-upload accept="image/*" :show-file-list="false"
            :http-request="(option) => customUploadRequest(option, index)" :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess">
            <el-button :icon="isLoading ? Loading : Upload" :loading="isLoading">點擊上傳圖片</el-button>
          </el-upload>
          <el-icon style="margin-left: 15px;" :size="20" :style="{ 'color': field.image ? '#67c23a' : '#909399' }">
            <CircleCheckFilled />
          </el-icon>
          <el-button type="danger" style="margin-left: 15px;" circle :icon="Delete" :disabled="!field.image"
            @click="removeImage(index)" />
        </el-form-item>
      </template>

      <el-divider />
      <el-form-item v-for="(value, key, index) in map" :key="index" :label="value">
        <el-upload accept="image/*" :show-file-list="false"
          :http-request="(option) => customUploadRequest(option, -1 - index)" :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess">
          <el-button :icon="isLoading ? Loading : Upload" :loading="isLoading">上傳{{ value }}</el-button>
        </el-upload>
        <el-icon style="margin-left: 15px;" :size="20" :style="{ 'color': attraction[key] ? '#67c23a' : '#909399' }">
          <CircleCheckFilled />
        </el-icon>
        <el-button type="danger" style="margin-left: 15px;" circle :icon="Delete" :disabled="!attraction[key]"
          @click="removeImage(-1 - index)" />
      </el-form-item>

      <div class="demo-image">
        <div v-for="(value, key) in map" class="block">
          <span class="demonstration">{{ value }}</span>
          <el-image :src="attraction[key] || ''" />
        </div>
      </div>

      <div class="demo-image">
        <div v-for="field in attraction.fields" class="block">
          <span class="demonstration">{{ field.name }}</span>
          <el-image :src="field.image || ''" />
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

  </template>
</template>

<script setup>
import { ref, watch } from "vue";
import { Upload, Check, Delete, Loading, CircleCheck, CircleCheckFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const clientId = "50166df8bcf9289";
const uploadUrl = "https://api.imgur.com/3/image";
const isLoading = ref(false);

const props = defineProps({
  attraction: Object,
});
const emits = defineEmits(["submit", "reset"]);

const formRef = ref(null);
const requiredFields = [
  { prop: "name", label: "名稱", placeholder: "請輸入景點名稱" },
  { prop: "address", label: "地址", placeholder: "請輸入景點地址" },
];
const rules = {
  name: [{ required: true, message: "請輸入景點名稱", trigger: "blur" }],
  address: [{ required: true, message: "請輸入景點地址", trigger: "blur" }],
};
const map = {
  coverImage: "封面圖片",
  backgroundImage: "背景圖片",
};

// image upload
const handleBeforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) ElMessage.error("上傳圖片大小不能超過 5MB!");
  isLoading.value = true;
  return isLt2M;
};

const customUploadRequest = async (option, index) => {
  const formData = new FormData();
  formData.append("image", option.file);
  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Authorization": `Client-ID ${clientId}` },
      body: formData,
    });
    const result = await response.json();
    console.log("Upload result:", result);
    if (result.success) {
      if (index >= 0) {
        props.attraction.fields[index].image = result.data.link;
      } else {
        if (index === -1) props.attraction.coverImage = result.data.link;
        if (index === -2) props.attraction.backgroundImage = result.data.link;
      }
      // option.onSuccess(result, option.file);
      ElMessage.success("圖片上傳成功！");
    } else {
      option.onError(result);
      ElMessage.error(`圖片上傳失敗: ${result.data.error}`);
    }
    isLoading.value = false;
  } catch (error) {
    option.onError(error);
    ElMessage.error("上傳失敗，請檢查網路或稍後再試！");
  }
};

const removeImage = (index) => {
  if (index >= 0) {
    props.attraction.fields[index].image = null;
  } else {
    if (index === -1) props.attraction.coverImage = null;
    if (index === -2) props.attraction.backgroundImage = null;
  }
};

const handleUploadSuccess = (response, file) => {
  console.log("Upload success:", props.attraction);
};


const handleSubmit = () => {
  formRef.value.validate(valid => { if (valid) emits("submit"); });
};

const resetForm = () => {
  formRef.value.resetFields();
  emits("reset");
};
</script>

<style scoped>
.upload-item {
  text-align: center;
}

.demo-image {
  margin: 10px 0;
}

.demo-image .block {
  padding: 10px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image .block:last-child {
  border-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
