const {PrismaClient} = require("@prisma/client");

class TeacherService {
    prisma = new PrismaClient()
    userDB = this.prisma.users

    async getTeachers() {
        return this.userDB.findMany({
            where: {
                isTeacher: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });
    }

}

module.exports = new TeacherService()