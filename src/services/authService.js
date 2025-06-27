const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuthService {
    async Login(login, password) {
        const user = await prisma.user.findUnique({ where: { login } });
        if (!user || await bcrypt.compare(password, user.password)) {
            throw new Error('Credenciais Inválidas');
        }

        return {
            token: generateToken(user),
            user: user
        };
    }
}

module.exports = new AuthService();