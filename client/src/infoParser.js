import api from "@/axios/api.js";

export async function getInfo() {
    let info = JSON.parse(localStorage.getItem('info'))
    if (!info) {
        const {data} = await api.get('/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        setInfo(data)
        info = data
        console.log(info)
    }
    return info
}

export function rmInfo() {
    localStorage.removeItem('info')
}

export function setInfo(info) {
    localStorage.setItem('info', JSON.stringify(info))
}

export function isAdmin(info) {
    return info.isAdmin
}

export function isTeacher(info) {
    return info.teacher != null
}

export function isStudent(info) {
    return info.student != null
}