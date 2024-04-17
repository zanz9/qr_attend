const StudentService = require("../service/StudentService")
class StudentController {
    async getStudents(req, res, next) {
        try {
            const opId = parseInt(req.query.opId)
            const facultyId = parseInt(req.query.facultyId)
            const course = parseInt(req.query.course)
            const students = await StudentService.getStudents(opId, facultyId, course)
            return res.status(200).json(students)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new StudentController()