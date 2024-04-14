const {PrismaClient} = require("@prisma/client");
const ApiError = require("../../../exceptions/ApiError");

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

    async getLessonsFuture(skip, take) {
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
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
    }

    async getLessonNow(skip, take) {
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
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
    }

    async getLessonsPast(skip, take) {
        return this.lessonDB.findMany({
            where: {
                expiresIn: {
                    lte: new Date()
                }
            },
            orderBy: [
                {
                    expiresIn: 'desc'
                },
                {
                    startedAt: 'desc'
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
            },
            take: take ? take : 100,
            skip: skip ? skip : 0,
        })
    }

    async getLesson(uuid) {
        return this.lessonDB.findUnique({
            where: {
                uuid,
                AND: [
                    {
                        startedAt: {
                            lte: new Date()
                        },
                    }, {
                        expiresIn: {
                            gte: new Date()
                        }
                    },
                ]
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
        return this.prisma.attends.create({
            data: {lessonId, userId}
        })
    }
}

module.exports = new LessonService()