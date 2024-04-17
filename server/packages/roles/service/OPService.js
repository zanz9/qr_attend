const {PrismaClient} = require("@prisma/client");

class OPService {
    prisma = new PrismaClient()

    async getOPs(facultyId) {
        console.log(facultyId)
        return this.prisma.oP.findMany(
            {
                where: {
                    facultyId
                }
            }
        )
    }

    async create(name, facultyId) {
        return this.prisma.oP.create({
            data: {
                name,
                facultyId
            }
        })
    }

    async getFaculties() {
        return this.prisma.faculty.findMany()
    }

    async createFaculty(name) {
        return this.prisma.faculty.create({
            data: {
                name
            }
        })
    }
}

module.exports = new OPService()