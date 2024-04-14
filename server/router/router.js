const {body} = require("express-validator");
const AuthController = require("../packages/auth/controller/AuthController");
const LessonController = require("../packages/lesson/controller/LessonController");
const TeacherController = require("../packages/teacher/controller/TeacherController");
const Router = require('express').Router

const router = Router()

//AUTH
router.post('/register',
    body('email').isEmail(),
    body('firstName').isLength({min: 2, max: 32}),
    body('lastName').isLength({min: 2, max: 32}),
    body('password').isLength({min: 8, max: 32}),
    AuthController.register)
router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    AuthController.login)
router.get('/logout', AuthController.logout)
router.get('/refresh', AuthController.refresh)

// TEACHER
router.get('/teachers', TeacherController.getTeachers)

// LESSONS
router.post('/lesson',
    body('name').isLength({min: 2, max: 32}),
    body('teacherId').isNumeric(),
    body('startDate').isISO8601().toDate(),
    body('endDate').isISO8601().toDate(),
    LessonController.create)
router.delete('/lesson/:id', LessonController.delete)


module.exports = router