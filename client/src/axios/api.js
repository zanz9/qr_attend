import axios from 'axios'
import {RouterNames} from "@/router/routes.js";
import router from "@/router/index.js";
import {rmInfo} from "@/infoParser.js";

const api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000/api',
    // baseURL: 'http://58252.zetalink.ru:3000/api',
})

api.interceptors.response.use(response => {
    return response
}, async function(error) {
    const originalRequest = error.config
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true
        const response = await api.get('/refresh')
        localStorage.setItem('accessToken', response.data['accessToken'])
        originalRequest.headers['Authorization'] = `Bearer ${response.data['accessToken']}`
        return api(originalRequest)
    }
    if (error.response.status === 401) {
        localStorage.removeItem('accessToken')
        rmInfo()
        router.push({ name: RouterNames.Login }).then(() => {
        })
    }
    return Promise.reject(error)
})
export default api