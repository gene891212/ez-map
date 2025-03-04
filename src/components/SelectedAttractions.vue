<template>
  <el-button type="default" @click="goBack">
    返回
  </el-button>
  <el-button type="primary" @click="printPDF">
    列印 PDF
  </el-button>

  <!-- PDF 輸出區塊 -->
  <div id="pdf-content">
    <div class="a4-container pdf-page" v-for="(attraction, index) in selectedAttractions"
      :style="{ 'background-image': `url(${attraction.backgroundImage})` }">
      <div class="avoid-break">
        <el-row :gutter="20">
          <el-col :span="24">
            <h1>{{ index + 1 }}. {{ attraction.name }}</h1>
          </el-col>
          <el-col :span="24">
            <p>{{ attraction.address }}</p>
          </el-col>
          <el-col :span="12">
            <img :src="attraction.coverImage" class="cover-image" />
          </el-col>
          <el-col :span="12" v-for="(field, index) in attraction.fields" :key="index">
            <el-row :gutter="20">
              <el-col :span="12">
                <h2>{{ index }} {{ field.name }}</h2>
                <p>{{ field.value }}</p>
              </el-col>
              <el-col :span="12">
                <div class="image-container">
                  <img v-if="field.image" :src="field.image" class="image" />
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAttractionStore } from "@/stores/attractionStore";
import Attraction from "@/models/Attraction";

const router = useRouter();
const attractionStore = useAttractionStore();
const { selectedAttractions } = storeToRefs(attractionStore);

const printPDF = () => {
  window.print();
};

const goBack = () => {
  router.push({ name: "Home" });
};
</script>

<style scoped>
.a4-container {
  width: 297mm;
  height: 210mm;
  padding: 10mm;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.pdf-page {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.avoid-break {
  page-break-inside: avoid;
}

h1 {
  margin: 0
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  object-position: center;
}

.image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 15px;
}

@page {
  size: A4 landscape;
}

/* 列印模式 */
@media print {

  /* 重設全局邊距，避免預設樣式影響 */
  html,
  body {
    margin: 0;
    padding: 0;
  }

  /* 隱藏所有非列印內容 */
  body * {
    visibility: hidden;
  }

  /* 只顯示 #pdf-content 區塊及其內容 */
  #pdf-content,
  #pdf-content * {
    visibility: visible;
  }

  #pdf-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 297mm;
    height: 210mm;
  }

  .pdf-page {
    page-break-after: always;
    /* -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important; */
  }
}

/* * {
  border: 1px solid black;
} */
</style>
