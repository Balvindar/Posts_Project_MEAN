const bcryptjs = require('bcryptjs');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

// create user
exports.createUser = (req,res,next) => {
    
    bcryptjs.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'User Created',
                result: result
            })
        }).catch(err => {
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            })
        })
    })

}


// login user
exports.loginUser = (req, res, next) => {

    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
        if (!user) {
            res.status(401).json({
                message: 'Auth Failed'
            })
        }
        fetchedUser = user;
        return bcryptjs.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
             res.status(401).json({
                message: 'Auth Failed'
            })
        }
        const token  = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
             process.env.JWT_KEY,
              {expiresIn: '1h'})

          res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
          })   
    })
    .catch(err => {
         res.status(401).json({
                message: 'Invalid authentication credentials!'
            })
    })
}