const {PrismaClient} = require("@prisma/client");

class TeacherService {
    prisma = new PrismaClient()
    userDB = this.prisma.users
    async getTeachers() {
        return this.userDB.findMany({
            where: {
                teacherId: {
                    not: null
                }
            },
        });
    }

    async getTeacher(id) {
        return this.userDB.findUnique({
            where: {
                id
            }
        });
    }

}

module.exports = new TeacherService()