import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";

export const  routeList = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView
    }
]