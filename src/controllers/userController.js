const userService = require('../services/userService');
const UserService = require('../services/userService');

class UserController {
    async Create(req, res) {
        try {
            // const { login, name, password, level, details, } = req.body

            const user = await UserService.Create(req.body)

            let result

            const { password, createdAt, details, ...cleanUser } = user
            if (details) {
                const { createdAt: detailsCreatedAt, ...clenDetails } = details
                result = {
                    ...cleanUser,
                    ...clenDetails,
                }
            } else {
                result = {
                    ...cleanUser
                }
            }

            res.status(201).send({ data: result })
        }
        catch (error) {
            res.status(400).send({ message: error.message })
        }
    }

    async Update(req, res) {
        try {
            const { id } = req.params

            const user = await UserService.Update(id, req.body)

            const { details, password, createdAt, ...userData } = user;

            res.status(201).send({ ...userData, ...details })
        }
        catch (error) {
            res.status(400).send({ message: error.message })
        }
    }

    async FindAll(req, res) {
        try {
            const users = await userService.FindAll();

            // Usado para retornar os dados no mesmo nível
            const result = users.map(user => {
                const { details, ...userData } = user;
                return { ...userData, ...details }
            })

            res.status(200).json({ data: result });
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }

    }

    async FindById(req, res) {
        const { id } = req.params
        let result

        try {
            const user = await userService.FindById(id);

            const { details, ...cleanData } = user

            if (details) {
                const { ...data } = details
                result = {
                    ...cleanData,
                    ...data
                }
            } else {
                result = {
                    ...cleanData
                }
            }

            res.status(200).json({ data: result })
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }

    }

    async Delete(req, res) {
        try {
            const { id } = req.params;
            const result = await UserService.Delete(id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
}

module.exports = new UserController();