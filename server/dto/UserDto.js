class UserDto {
    id
    email
    firstName
    lastName
    isAdmin
    teacher
    student

    constructor(user) {
        this.id = user.id
        this.email = user.email
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.isAdmin = user.isAdmin
        this.teacher = user.teacher
        this.student = user.student
    }
}

module.exports = UserDto;