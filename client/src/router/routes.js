import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";


export class RouterNames {
    static Login = 'Login'
    static Register = 'Register'
    static Home = 'Home'
}
export const  routeList = [
    {
        path: '/',
        name: RouterNames.Home,
        component: HomeView
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