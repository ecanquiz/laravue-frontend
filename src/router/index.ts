import {createRouter, createWebHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router'
import { computed } from "vue"
import { useAuthStore } from '@/modules/Auth/stores'
import auth from "@/middleware/auth"
import middlewarePipeline from "@/router/middlewarePipeline"
import AuthRoutes from "@/modules/Auth/routes"
import AuthorizationRoutes from "@/modules/Authorization/routes"
import UserRoutes from "@/modules/User/routes"

const storeAuth = computed(() => useAuthStore())

const routes: Array<RouteRecordRaw> = [
  {
    path: "/option-one",
    name: "option-one",
    meta: { middleware: [auth] },
    component: () => import("@/views/OptionOne.vue").then(m => m.default)
  },
  {
    path: "/option-two",
    name: "option-two",
    meta: { middleware: [auth] },
    component: () => import("@/views/OptionTwo.vue").then(m => m.default)
  },
  {
    path: "/option-three",
    name: "option-three",
    meta: { middleware: [auth] },
    component: () => import("@/views/OptionThree.vue").then(m => m.default)
  },
  ...AuthRoutes.map(route => route),
  ...AuthorizationRoutes.map(route => route),
  ...UserRoutes.map(route => route)
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  
  routes,
  scrollBehavior(to, from, savedPosition): any {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const middleware = to.meta.middleware;
  const context = { to, from, next, storeAuth };

  if (!middleware) {
    return next();
  }

  middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router
