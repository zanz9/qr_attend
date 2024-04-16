const {PrismaClient} = require("@prisma/client");

class StudentService {
    prisma = new PrismaClient()
    userDB = this.prisma.users

    async getStudents(opId, facultyId, course) {
        // const facultyFilter = !!facultyId
        // const opFilter = !!opId
        // const courseFilter = !!course
        // let opForm;
        // if (facultyFilter) {
        //     opForm = {
        //         facultyId
        //     }
        // } else if (opFilter) {
        //     opForm = opId
        // }
        //
        // if (courseFilter) {
        //     return this.userDB.findMany({
        //         where: {
        //             student: {
        //                 opId: opId, course: course
        //             },
        //         }
        //     });
        // }
        return this.userDB.findMany({
            where: {
                student: {
                    opId: opId, course: course
                },
            }
        });
    }


}

module.exports = new StudentService()