const TeacherService = require("../service/TeacherService")

class TeacherController {
    async getTeachers(req, res, next) {
        try {
            const teachers = await TeacherService.getTeachers()
            return res.status(200).json(teachers)
        } catch (e) {
            next(e)
        }
    }

    async changeFaculty(req, res, next) {
        try {
            const {teacherId, facultyId} = req.body
            const teacher = await TeacherService.changeFaculty(teacherId, facultyId)
            return res.status(200).json(teacher)
        } catch (e) {
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const {firstName, lastName, email, password} = req.body
            const facultyId = parseInt(req.body.facultyId)
            const teacher = await TeacherService.create(firstName, lastName, email, password, facultyId)
            return res.status(200).json({...teacher, message: 'Аккаунт создан!'})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TeacherController()