import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import CreateLessonView from "@/views/lesson/CreateLessonView.vue";
import LessonsView from "@/views/lesson/LessonsView.vue";
import LessonView from "@/views/lesson/LessonView.vue";
import PastLessonsView from "@/views/lesson/PastLessonsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import CreateOPView from "@/views/admin/CreateOPView.vue";
import CreateFacultyView from "@/views/admin/CreateFacultyView.vue";
import CreateTeacher from "@/views/admin/CreateTeacher.vue";
import {getInfo, isAdmin} from "@/infoParser.js";

export class RouterNames {
    static Login = 'Login'
    static Register = 'Register'
    static Home = 'Home'
    static CreateLesson = 'CreateLesson'
    static Lessons = 'Lessons'
    static Lesson = 'Lesson'
    static PastLesson = 'PastLesson'
    static Profile = 'Profile'
    static CreateOP = 'CreateOP'
    static CreateFaculty = 'CreateFaculty'
    static CreateTeacher = 'CreateTeacher'
}

export const routeList = [
    {
        path: '/',
        name: RouterNames.Home,
        component: HomeView,
        redirect: {name: RouterNames.Lessons},
        children: [
            {
                path: '/create-lesson',
                name: RouterNames.CreateLesson,
                component: CreateLessonView
            },
            {
                path: '/lessons',
                name: RouterNames.Lessons,
                component: LessonsView
            },
            {
                path: '/lesson/:uuid',
                name: RouterNames.Lesson,
                component: LessonView
            },
            {
                path: '/past-lessons',
                name: RouterNames.PastLesson,
                component: PastLessonsView
            },
            {
                path: '/profile',
                name: RouterNames.Profile,
                component: ProfileView
            },
            {
                path: '/create-op',
                name: RouterNames.CreateOP,
                component: CreateOPView,
                guard: isAdmin(getInfo())
            },
            {
                path: '/create-faculty',
                name: RouterNames.CreateFaculty,
                component: CreateFacultyView,
                guard: isAdmin(getInfo())
            },
            {
                path: '/create-teacher',
                name: 'CreateTeacher',
                component: CreateTeacher,
                guard: isAdmin(getInfo())
            }
        ]
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