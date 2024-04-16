export function getInfo() {
    return JSON.parse(localStorage.getItem('info'))
}

export function setInfo(info) {
    localStorage.setItem('info', JSON.stringify(info))
}

export function isAdmin() {
    return getInfo().isAdmin
}

export function isTeacher() {
    return getInfo().teacher != null
}

export function isStudent() {
    return getInfo().student != null
}