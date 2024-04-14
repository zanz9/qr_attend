import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CreateLessonView from "@/views/CreateLessonView.vue";


export class RouterNames {
    static Login = 'Login'
    static Register = 'Register'
    static Home = 'Home'
    static CreateLesson = 'CreateLesson'
}

export const routeList = [
    {
        path: '/',
        name: RouterNames.Home,
        component: HomeView,
        children: [{
            path: 'create-lesson',
            name: RouterNames.CreateLesson,
            component: CreateLessonView
        },]
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