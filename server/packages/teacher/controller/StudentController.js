const StudentService = require("../service/StudentService")
class StudentController {
    async getStudents(req, res, next) {
        try {
            // const {opId, facultyId, course} = req.query
            const students = await StudentService.getStudents()
            return res.status(200).json(students)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new StudentController()