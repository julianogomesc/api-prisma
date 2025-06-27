const authService = require('../services/authService');

class AuthController {
    async Login(req, res) {
        try {
            const { login, password } = req.body
            const token = await authService.Login(login, password)

            res.status(200).send({ data: token })
        }
        catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
}

module.exports = new AuthController();