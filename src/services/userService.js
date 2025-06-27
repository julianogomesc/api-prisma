const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let salt = 10

class UserService {
    async Create({ login, name, password, level, details }) {

        const existingUser = await prisma.user.findUnique({
            where: {
                login
            }
        })

        if (existingUser) {
            throw new Error('Já existe um usuário com este login')
        }

        if ((level === 2 || level === 3) && !password) {
            throw new Error('Password é obrigatório para usuários level 2 e 3')
        }

        const hashPass = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                login,
                name,
                password: hashPass,
                level,
                details: details ? {
                    create: details
                } : undefined,
            },
            include: {
                details: true,
            }
        })

        return user;
    }

    async Update(id, data) {
        const userExists = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!userExists) {
            throw new Error('Usuário não encontrado')
        }

        const { login, name, password, level, email, phone, whatsapp, country, state, city, address, reference, observations } = data;

        const hashPass = password ? await bcrypt.hash(password, salt) : undefined

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                login,
                name,
                level,
                ...(hashPass && { password: hashPass }),
                details: {
                    upsert: {
                        create: { email, phone, whatsapp, country, state, city, address, reference, observations },
                        update: { email, phone, whatsapp, country, state, city, address, reference, observations }
                    }
                }
            },
            include: {
                details: true
            }
        });

        return updatedUser;
    }

    async FindAll() {
        return await prisma.user.findMany({
            select: {
                id: true,
                login: true,
                name: true,
                level: true,
                details: {
                    select: {
                        email: true,
                        phone: true,
                        whatsapp: true,
                        country: true,
                        state: true,
                        city: true,
                        address: true,
                        reference: true,
                        observations: true,
                    }
                }
            }
        })
    }

    async FindById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                login: true,
                name: true,
                level: true,
                details: {
                    select: {
                        email: true,
                        phone: true,
                        whatsapp: true,
                        country: true,
                        state: true,
                        city: true,
                        address: true,
                        reference: true,
                        observations: true
                    }
                }
            }
        })
    }

    async Delete(id) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        await prisma.userDetail.delete({ where: { userId: id } })

        await prisma.user.delete({ where: { id } });

        return { message: `Usuário ${user.name} removido com sucesso!` }
    }
}

module.exports = new UserService();