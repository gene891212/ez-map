<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>註冊</h2>
      <el-form @submit.prevent="handleRegister">
        <el-form-item label="Email">
          <el-input v-model="email" type="email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" @click="handleRegister">註冊</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { registerUser } from "@/services/authService";
import { ElMessage } from "element-plus";

const email = ref("");
const password = ref("");

const handleRegister = async () => {
  try {
    await registerUser(email.value, password.value);
    ElMessage.success("註冊成功！");
  } catch (error) {
    ElMessage.error(error.message);
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.register-card {
  width: 400px;
  padding: 20px;
}
</style>
  