const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); // this string should be same as in user.js while login
        req.userData = { // modifying req for storing user id and connecting it to post
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();
    } catch (error) {
        res.status(401).json({message: 'Auth failed!'})
    }
}