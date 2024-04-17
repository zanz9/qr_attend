import {createMemoryHistory, createRouter, createWebHistory} from 'vue-router'
import {routeList, RouterNames} from "@/router/routes.js";
import {getInfo, isAdmin} from "@/infoParser.js";

const router = createRouter({
    history: createMemoryHistory(import.meta.env.BASE_URL),
    routes: routeList
})

// GOOD
router.beforeResolve(async (to, from, next) => {
    let isNotLogin = !localStorage.getItem('accessToken');
    if ((isNotLogin && to.name !== RouterNames.Login) && (isNotLogin && to.name !== RouterNames.Register)) {
        next({name: RouterNames.Login})
    } else {
        next()
    }
})



export default router
