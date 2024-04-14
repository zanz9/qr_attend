const {PrismaClient} = require("@prisma/client");

class LessonService {
    prisma = new PrismaClient()
    lessonDB = this.prisma.lessons

    async create(name, teacherId, startedAt, expiresIn) {
        return this.lessonDB.create({
            data: {
                name,
                createdFrom: teacherId,
                startedAt,
                expiresIn
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

    async getLessons() {
        return this.lessonDB.findMany({
            where: {
                startedAt: {
                    gte: new Date()
                }
            },
            orderBy: [
                {
                    startedAt: 'asc'
                },
                {
                    expiresIn: 'asc'
                }
            ],
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                attends: false
            }
        })
    }

    async getLessonNow() {
        return this.lessonDB.findMany({
            where: {
                AND: [{
                    startedAt: {
                        lte: new Date()
                    },
                }, {
                    expiresIn: {
                        gte: new Date()
                    }
                },]
            },
            orderBy: [
                {
                    startedAt: 'asc'
                },
                {
                    expiresIn: 'asc'
                },
            ],
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                attends: false
            }
        })
    }

    async getLesson(uuid) {
        return this.lessonDB.findUnique({
            where: {
                uuid
            },
            include: {
                teacher: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                attends: true
            }
        })
    }
}

module.exports = new LessonService()