const {PrismaClient} = require("@prisma/client");
const ApiError = require("../../../exceptions/ApiError");

class LessonService {
    prisma = new PrismaClient()
    lessonDB = this.prisma.lessons

    async create(name, cabinet, teacherId, startedAt, expiresIn, opId) {
        return this.lessonDB.create({
            data: {
                name,
                cabinet,
                createdFrom: teacherId,
                startedAt,
                expiresIn,
                opId
            }
        });
    }

    async delete(id) {
        return this.lessonDB.delete({
            where: {
                uuid: id
            }
        })
    }

    async getLessonsOP(type, skip, take, opId) {
        let where;
        if (type === 'future') {
            where = {AND: [{startedAt: {gte: new Date()}, opId}]}
        } else if (type === 'now') {
            where = {AND: [{startedAt: {lte: new Date()}, opId}, {expiresIn: {gte: new Date()}}]}
        } else if (type === 'past') {
            where = {AND: [{expiresIn: {lte: new Date()}, opId}]}
        }
        const count = await this.lessonDB.count({where})
        const lessons = await this.lessonDB.findMany({
            where,
            orderBy: [{
                startedAt: 'asc'
            }, {
                expiresIn: 'asc'
            }],
            include: {
                teacher: {select: {firstName: true, lastName: true}},
                attends: false
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
        return {count, lessons}
    }

    async getLessonsFaculty(type, skip, take, facultyId) {
        let where;
        if (type === 'future') {
            where = {
                AND: [{
                    startedAt: {gte: new Date()},
                    op: {facultyId}
                }]
            }
        } else if (type === 'now') {
            where = {AND: [{startedAt: {lte: new Date()}, op: {facultyId}}, {expiresIn: {gte: new Date()}}]}
        } else if (type === 'past') {
            where = {AND: [{expiresIn: {lte: new Date()}, op: {facultyId}}]}
        }
        const count = await this.lessonDB.count({
            where: where
        })
        const lessons = await this.lessonDB.findMany({
            where,
            orderBy: [{
                startedAt: 'asc'
            }, {
                expiresIn: 'asc'
            }],
            include: {
                teacher: {select: {firstName: true, lastName: true}},
                attends: false
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
        return {count, lessons}
    }

    async getLessons(type, skip, take) {
        let where;
        if (type === 'future') {
            where = {AND: [{startedAt: {gte: new Date()},}]}
        } else if (type === 'now') {
            where = {AND: [{startedAt: {lte: new Date()}}, {expiresIn: {gte: new Date()}}]}
        } else if (type === 'past') {
            where = {AND: [{expiresIn: {lte: new Date()}}]}
        }
        const count = await this.lessonDB.count({
            where: where
        })
        const lessons = await this.lessonDB.findMany({
            where,
            orderBy: [{
                startedAt: 'asc'
            }, {
                expiresIn: 'asc'
            }],
            include: {
                teacher: {select: {firstName: true, lastName: true}},
                attends: false
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
        return {count, lessons}
    }

    async getLesson(uuid) {
        return this.lessonDB.findUnique({
            where: {
                uuid,
            },
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                attends: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        },
                        lesson: false
                    }
                },
                op: {
                    include: {
                        faculty: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
    }

    async scan(lessonId, userId) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: userId
            }
        })
        if (!user || user.isTeacher) {
            throw ApiError.BadRequest('User not found')
        }
        const loginTime = new Date()
        return this.prisma.attends.create({
            data: {lessonId, userId, loginTime}
        })
    }
}

module.exports = new LessonService()