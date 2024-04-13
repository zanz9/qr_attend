import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";


export class RouterNames {
    static Login = 'Login'
    static Register = 'Register'
}
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
    },
    {
        path: '/login',
        name: RouterNames.Login,
        component: LoginView
    },
    {
        path: '/register',
        name: RouterNames.Register,
        component: RegisterView
    }
]