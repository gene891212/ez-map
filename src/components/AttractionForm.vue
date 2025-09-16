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
import { uploadImage, validateImageFile, extractPathFromUrl, deleteImage } from '../services/imageUploadService.js';
import { database } from '../firebase.js';
import { ref as dbRef, update } from 'firebase/database';
import { useRoute } from 'vue-router';

const isLoading = ref(false);
const route = useRoute();

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
  try {
    validateImageFile(file, 5);
    isLoading.value = true;
    return true;
  } catch (error) {
    ElMessage.error(error.message);
    return false;
  }
};

// 自動保存到 Firebase Database
const saveToDatabase = async () => {
  try {
    if (route.params.id && props.attraction) {
      const attractionRef = dbRef(database, `attractions/${route.params.id}`);
      await update(attractionRef, props.attraction.toObject());
      console.log("圖片更新已自動保存到資料庫");
    }
  } catch (error) {
    console.error("自動保存失敗:", error);
  }
};

const customUploadRequest = async (option, index) => {
  try {
    // 決定上傳路徑
    let uploadPath = 'attractions/';
    if (index === -1) uploadPath = 'attractions/cover/';
    else if (index === -2) uploadPath = 'attractions/background/';
    else uploadPath = 'attractions/fields/';

    // 如果有舊圖片，先刪除
    await deleteOldImage(index);

    // 上傳新圖片
    const result = await uploadImage(option.file, uploadPath);
    
    if (result.success) {
      // 更新對應的圖片 URL
      if (index >= 0) {
        // 更新 fields 中的圖片
        props.attraction.fields[index].image = result.url;
      } else {
        if (index === -1) {
          // 更新封面圖片
          props.attraction.coverImage = result.url;
        }
        if (index === -2) {
          // 更新背景圖片
          props.attraction.backgroundImage = result.url;
        }
      }
      
      ElMessage.success("圖片上傳成功！");
      console.log("Updated attraction:", props.attraction);
      
      // 自動保存到資料庫
      await saveToDatabase();
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Upload error:', error);
    ElMessage.error(error.message || "上傳失敗，請稍後再試！");
    isLoading.value = false;
  }
};

// 刪除舊圖片的輔助函數
const deleteOldImage = async (index) => {
  try {
    let oldImageUrl = null;
    
    if (index >= 0) {
      oldImageUrl = props.attraction.fields[index].image;
    } else if (index === -1) {
      oldImageUrl = props.attraction.coverImage;
    } else if (index === -2) {
      oldImageUrl = props.attraction.backgroundImage;
    }
    
    if (oldImageUrl) {
      const imagePath = extractPathFromUrl(oldImageUrl);
      if (imagePath) {
        await deleteImage(imagePath);
      }
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
    // 不需要顯示錯誤訊息，因為這只是清理動作
  }
};

const removeImage = async (index) => {
  try {
    // 先刪除 Firebase Storage 中的圖片
    await deleteOldImage(index);
    
    // 清除 URL
    if (index >= 0) {
      props.attraction.fields[index].image = null;
    } else {
      if (index === -1) {
        props.attraction.coverImage = null;
      }
      if (index === -2) {
        props.attraction.backgroundImage = null;
      }
    }
    
    ElMessage.success("圖片已刪除");
    
    // 自動保存到資料庫
    await saveToDatabase();
  } catch (error) {
    console.error('Error removing image:', error);
    ElMessage.error("刪除圖片失敗");
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
