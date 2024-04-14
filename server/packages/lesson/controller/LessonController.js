const ApiError = require("../../../exceptions/ApiError");
const {validationResult} = require("express-validator");
const LessonService = require("../service/LessonService");

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
}

module.exports = new LessonController()