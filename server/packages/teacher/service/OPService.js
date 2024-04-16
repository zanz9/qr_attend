const {PrismaClient} = require("@prisma/client");

class OPService {
    prisma = new PrismaClient()

    async getOPs(facultyId) {
        return this.prisma.oP.findMany(
            {
                where: {
                    facultyId
                }
            }
        )
    }

    async getFaculties() {
        return this.prisma.faculty.findMany()
    }
}

module.exports = new OPService()