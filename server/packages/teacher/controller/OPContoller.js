const OPService = require("../service/OPService")
const AuthService = require("../../auth/service/AuthService")
const ApiError = require("../../../exceptions/ApiError");

class OPContoller {
    async getOPs(req, res, next) {
        try {
            if (!req.user) {
                const facultyId = req.query.facultyId
                const op = await OPService.getOPs(facultyId)
                return res.json(op)
            }
            const user = req.user.id
            const userData = await AuthService.getUserById(user.id)

            if (userData.teacher == null) {
                next(ApiError.BadRequest("Не обработано"))
            }
            const op = await OPService.getOPs(userData.teacher.facultyId)
            return res.json(op)
        } catch (e) {
            next(e)
        }
    }

    async getFaculties(req, res, next) {
        try {
            const faculties = await OPService.getFaculties()
            return res.json(faculties)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new OPContoller()