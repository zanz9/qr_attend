import { createRouter, createWebHistory } from 'vue-router'
import {routeList} from "@/router/routes.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList
})

export default router
