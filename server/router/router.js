const {body} = require("express-validator");
const AuthController = require("../packages/auth/controller/AuthController");
const LessonController = require("../packages/lesson/controller/LessonController");
const TeacherController = require("../packages/teacher/controller/TeacherController");
const StudentController = require("../packages/teacher/controller/StudentController");
const OPContoller = require("../packages/teacher/controller/OPContoller");

const Router = require('express').Router
const authMiddleware = require('../packages/auth/middleware/authMiddleware')

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
router.get('/me', authMiddleware, AuthController.getMe)

router.get('/faculties', OPContoller.getFaculties)
router.get('/op', OPContoller.getOPs)

const roles = Router()
roles.get('/teachers', TeacherController.getTeachers)
roles.get('/students', StudentController.getStudents)

router.use('/roles', roles)


const lessonRouter = Router()
lessonRouter.post('/',
    body('name').isLength({min: 2, max: 32}),
    body('cabinet'),
    body('teacherId').isNumeric(),
    body('startDate').isISO8601().toDate(),
    body('endDate').isISO8601().toDate(),
    LessonController.create)
lessonRouter.delete('/:id', LessonController.delete)

lessonRouter.get('/now', LessonController.getLessonNow)
lessonRouter.get('/future', LessonController.getLessonsFuture)
lessonRouter.get('/past', LessonController.getLessonsPast)

lessonRouter.get('/op', OPContoller.getOPs)
lessonRouter.get('/', LessonController.scan)
lessonRouter.get('/test', LessonController.scan)

lessonRouter.get('/:uuid', LessonController.getLesson)

router.use('/lesson', authMiddleware, lessonRouter)

module.exports = router