<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>登入</h2>
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Email">
          <el-input v-model="email" type="email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" @click="handleLogin">登入</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { loginUser } from "@/services/authService";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await loginUser(email.value, password.value);
    ElMessage.success("登入成功！");
  } catch (error) {
    ElMessage.error(error.message);
  }
  router.push("/");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-card {
  width: 400px;
  padding: 20px;
}
</style>
