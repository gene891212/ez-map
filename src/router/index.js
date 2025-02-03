import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

import HomeView from '@/views/HomeView.vue';
import EditAttraction from "@/components/EditAttraction.vue";
import AddAttraction from "@/components/AddAttraction.vue";
import SelectedAttractions from "@/components/SelectedAttractions.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "attraction/:id",
        name: "EditAttraction",
        component: EditAttraction,
      },
      {
        path: "add",
        name: "AddAttraction",
        component: AddAttraction,
      },
      // {
      //   path: "selected",
      //   name: "SelectedAttractions",
      //   component: SelectedAttractions,
      // }
    ],
  },
  {
    path: "/selected",
    name: "SelectedAttractions",
    component: SelectedAttractions,
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register }
];

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式
  routes,
});

// 導航守衛：檢查使用者是否登入
router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    console.log("user", user);  
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!user) {
        next("/login"); // 若未登入，導向登入頁面
      } else {
        next(); // 若已登入，繼續導航
      }
    } else {
      next(); // 其他頁面無需登入
    }
  });
});

export default router;
