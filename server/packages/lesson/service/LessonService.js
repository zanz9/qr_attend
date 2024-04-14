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
}

module.exports = new LessonService()