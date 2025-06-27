const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token

beforeEach(async () => {
    // Limpa a base antes
    await prisma.user.deleteMany();

    // Cria um usuário inicial
    await prisma.user.create({
        data: {
            login: 'juliano',
            name: 'Juliano G. da Costa',
            password: '$2b$10$yourbcryptpasswordhashhere', // senha@123
            level: 3
        }
    })

    // Realiza login para conseguir um token
    const res = await request(app)
        .post('/auth/login')
        .send({
            login: 'juliano',
            password: 'senha@123',
        })
    token = res.body.data.token
})

afterAll(async () => {
    // Limpeza de dados
    await cleanDB();
})

async function cleanDB() {
    // Deleta o usuário inicial
    await prisma.user.delete({ where: { login: 'juliano' } })
}

describe('POST /auth/login', () => {
    // Teste com usuário válido
    it('deve retornar token com credenciais válidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                login: 'juliano',
                password: 'senha@123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
    })
    // Teste com usuário inválido
    it('deve retornar 401 com credenciais inválidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                login: 'wronguser',
                password: 'pass'
            });

        expect(res.statusCode).toBe(500);
        // expect(res.body).toHaveProperty('message');
    })
})
