const ApiError = require("../../../exceptions/ApiError");
const {validationResult} = require("express-validator");
const LessonService = require("../service/LessonService");
const TokenService = require("../../auth/service/TokenService");

class LessonController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))
            }
            const {name, teacherId, startDate, endDate} = req.body
            const lesson = await LessonService.create(name, teacherId, startDate, endDate)
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
            const lessons = await LessonService.getLessonsFuture(skip, take)
            return res.json(lessons)
        } catch (e) {
            next(e)
        }
    }

    async getLessonNow(req, res, next) {
        try {
            const {page, limit} = req.query
            const skip = (page - 1) * limit || 0
            const take = parseInt(limit) || 0
            const lesson = await LessonService.getLessonNow(skip, take)
            return res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async getLessonsPast(req, res, next) {
        try {
            const {page, limit} = req.query
            const skip = (page - 1) * limit || 0
            const take = parseInt(limit) || 0
            const lessons = await LessonService.getLessonsPast(skip, take)
            return res.json(lessons)
        } catch (e) {
            next(e)
        }
    }

    async getLesson(req, res, next) {
        try {
            const {uuid} = req.params
            const lesson = await LessonService.getLesson(uuid)
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
                return next(ApiError.Forbidden("Не авторизирован"))
            }
            const userData = TokenService.validateRefreshToken(refreshToken)
            const userId = userData.id
            const lesson = await LessonService.scan(lessonId, userId)
            return res.json(lesson)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new LessonController()