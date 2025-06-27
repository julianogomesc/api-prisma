const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token

beforeAll(async () => {
    // Limpa a base antes
    await prisma.userDetail.deleteMany();
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
    // Busca pelo usuário criado no teste
    const user = await prisma.user.findUnique({ where: { login: 'user2_updated' } })
    // Valida se foi encontrado
    if (!user) {
        console.log('User removed');
        return;
    }
    // Se usuário criado no teste foi encontrado, deleta seus dados da tabela de detalhes
    await prisma.userDetail.delete({ where: { userId: user.id } })
    // Delete o usuário criado no teste
    await prisma.user.delete({ where: { id: user.id } })
}

describe('POST', () => {
    it('Inserting user with all of data(user e userDetails)', async () => {
        const res = await request(app)
            .post('/users/create')
            .set('Authorization', `${token}`)
            .send({
                login: 'user2',
                name: 'User number two',
                password: '123456',
                level: 2,
                details: {
                    email: "user@domain.com",
                    phone: "(41)99090-0000",
                    whatsapp: "(41)99999-3333",
                    country: "Brasil",
                    state: "PR",
                    city: "Curitiba",
                    address: "Rua Pedro Viriatto Parigot de Souza, Mossungue",
                    reference: "Próximo a DrogaRaia",
                    observations: "observação de teste..."
                }
            });

        expect(res.statusCode).toBe(201)
    })
})

describe('GET', () => {
    it('Route view all users', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body.data)).toBe(true)
        if (res.body.data.length > 0) {
            const user = res.body.data[0]
            expect(user).toHaveProperty('id')
            expect(user).toHaveProperty('login')
            expect(user).toHaveProperty('name')
            expect(user).toHaveProperty('level')
        }
    })

    it('Route view one user', async () => {
        const all = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)

        // console.log(all.body.data[0].id)

        const res = await request(app)
            .get(`/users/${all.body.data[0].id}`)
            .set('Authorization', `${token}`)

        expect(res.statusCode).toBe(200)
        expect(typeof (res.body.data)).toBe('object')
    })

})

describe('PUT', () => {
    it('Updating the user was created before', async () => {
        const all = await request(app)
            .get('/users')
            .set('Authorization', `${token}`)

        const user = await prisma.user.findUnique({ where: { login: 'user2' } })

        const updating = await request(app)
            .put(`/users/update/${user.id}`)
            .set('Authorization', `${token}`)
            .send({
                login: 'user2_updated',
                name: 'UserUpdated',
                email: 'user_updated@domain.com',
            })

        expect(updating.statusCode).toBe(201)
        expect(updating.body.login).toBe('user2_updated')
        expect(updating.body.name.length).toBe(11)
        expect(updating.body.email).toBe('user_updated@domain.com')
    })
})

describe('DELETE', () => {
    it('Inserting user and after that deleting this same user', async () => {
        const inserted = await request(app)
            .post('/users/create')
            .set('Authorization', `${token}`)
            .send({
                login: 'userToDelete',
                name: 'User to be deleted',
                password: 'deleted',
                level: 1,
                details: {
                    email: "delete@domain.com",
                    phone: "(41)99090-0000",
                    whatsapp: "(41)99999-3333",
                    country: "Brasil",
                    state: "SC",
                    city: "Florianópolis",
                    address: "Barra da lagoa",
                    reference: "Próximo ao centrinho",
                    observations: "Some observations..."
                }
            });

        expect(inserted.statusCode).toBe(201)
        const user = await prisma.user.findUnique({ where: { login: 'userToDelete' } })

        const deleting = await request(app)
            .delete(`/users/delete/${user.id}`)
            .set('Authorization', `${token}`)

        expect(deleting.statusCode).toBe(200)
    })
})