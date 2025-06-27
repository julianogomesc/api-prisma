const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        login: user.login,
        level: user.level,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}