const {PrismaClient} = require("@prisma/client");

class StudentService {
    prisma = new PrismaClient()
    userDB = this.prisma.users

    async getStudents(opId, facultyId, course) {
        const opFilter = !!opId
        const facultyFilter = !!facultyId
        const courseFilter = !!course
        let opForm;
        if (facultyFilter) {
            opForm = {
                facultyId
            }
        } else if (opFilter) {
            opForm = opId
        }

        if (courseFilter) {
            return this.userDB.findMany({
                where: {
                    student: {
                        opId: opForm, course: course
                    },
                }
            });
        }
        return this.userDB.findMany({
            where: {
                student: {
                    opId: opForm
                },
            }
        });
    }


}

module.exports = new StudentService()