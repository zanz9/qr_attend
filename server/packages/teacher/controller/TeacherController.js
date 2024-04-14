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
}

module.exports = new TeacherController()