const ApiError = require("../../../exceptions/ApiError");
const {validationResult} = require("express-validator");
const LessonService = require("../service/LessonService");
const TokenService = require("../../auth/service/TokenService");
const AuthService = require("../../auth/service/AuthService");

class LessonController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))
            }
            const userId = req.user.id
            const {name, cabinet, startDate, endDate, opId} = req.body
            let teacherId = req.body.teacherId
            if (teacherId === 0) {
                teacherId = userId
            }
            console.log(name, cabinet, startDate, endDate, opId, teacherId)
            const lesson = await LessonService.create(name, cabinet, teacherId, startDate, endDate, opId)
            return res.status(201).json({...lesson, message: "Урок создан"})
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params
            const lesson = await LessonService.delete(id)
            return res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async getLessonsFuture(req, res, next) {
        try {
            const {page, limit} = req.query
            const skip = (page - 1) * limit || 0
            const take = parseInt(limit) || 0

            const user = req.user
            const userData = await AuthService.getUserById(user.id)
            if (userData.teacher != null) {
                const facultyId = userData.teacher.facultyId
                const lessons = await LessonService.getLessonsFaculty('future', skip, take, facultyId)
                return res.json(lessons)
            }
            if (userData.student != null) {
                const opId = userData.student.opId
                const lessons = await LessonService.getLessonsOP('future', skip, take, opId)
                return res.json(lessons)
            }
            if (userData.isAdmin) {
                const lessons = await LessonService.getLessons('future', skip, take)
                return res.json(lessons)
            }
        } catch (e) {
            next(e)
        }
    }

    async getLessonNow(req, res, next) {
        try {
            const {page, limit} = req.query
            const skip = (page - 1) * limit || 0
            const take = parseInt(limit) || 0

            const user = req.user
            const userData = await AuthService.getUserById(user.id)
            if (userData.teacher != null) {
                const facultyId = userData.teacher.facultyId
                const lessons = await LessonService.getLessonsFaculty('now', skip, take, facultyId)
                return res.json(lessons)
            }
            if (userData.student != null) {
                const opId = userData.student.opId
                const lessons = await LessonService.getLessonsOP('now', skip, take, opId)
                return res.json(lessons)
            }
            if (userData.isAdmin) {
                const lessons = await LessonService.getLessons('now', skip, take)
                return res.json(lessons)
            }
        } catch (e) {
            next(e)
        }
    }

    async getLessonsPast(req, res, next) {
        try {
            const {page, limit} = req.query
            const skip = (page - 1) * limit || 0
            const take = parseInt(limit) || 0

            const user = req.user
            const userData = await AuthService.getUserById(user.id)
            if (userData.teacher != null) {
                const facultyId = userData.teacher.facultyId
                const lessons = await LessonService.getLessonsFaculty('past', skip, take, facultyId)
                return res.json(lessons)
            }
            if (userData.student != null) {
                const opId = userData.student.opId
                const lessons = await LessonService.getLessonsOP('past', skip, take, opId)
                return res.json(lessons)
            }
            if (userData.isAdmin) {
                const lessons = await LessonService.getLessons('past', skip, take)
                return res.json(lessons)
            }
        } catch (e) {
            next(e)
        }
    }

    async getLesson(req, res, next) {
        try {
            const {uuid} = req.params
            const lesson = await LessonService.getLesson(uuid)
            const now = new Date()
            lesson.current = lesson.startedAt.valueOf() < now.valueOf() && now.valueOf() < lesson.expiresIn.valueOf();
            return res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async scan(req, res, next) {
        try {
            const lessonId = req.query.uuid
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                next(ApiError.Forbidden("Не авторизирован"))
                return res.redirect(process.env.CLIENT_URL)
            }
            const userData = TokenService.validateRefreshToken(refreshToken)
            const userId = userData.id
            const lesson = await LessonService.scan(lessonId, userId)
            if (!lesson) {
                // res.json({message: 'Вы уже отсканировали этот урок'})
                return res.redirect(process.env.CLIENT_URL)
            }
            // res.json({message: 'Сканер отсканировал урок'})

            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new LessonController()