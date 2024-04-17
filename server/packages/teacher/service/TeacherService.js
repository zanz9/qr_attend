const {PrismaClient} = require("@prisma/client");
const ApiError = require("../../../exceptions/ApiError");
const bcrypt = require("bcrypt");

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
            select: {
                password: false,
                firstName: true,
                lastName: true,
                email: true,
                id: true,
                teacher: {
                    include: {
                        faculty: true
                    }
                }
            }
        });
    }

    async changeFaculty(teacherId, facultyId) {
        return this.userDB.update({
            where: {
                id: teacherId
            },
            data: {
                teacher: {
                    update: {
                        facultyId
                    }
                }
            }
        })
    }

    async create(firstName, lastName, email, password, facultyId) {
        const candidate = await this.userDB.findFirst({where: {email}})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовый адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)

        const teacher = await this.prisma.teacher.create({
            data: {
                facultyId
            }
        })
        return this.userDB.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashPassword,
                teacherId: teacher.id
            }
        })
    }
}

module.exports = new TeacherService()