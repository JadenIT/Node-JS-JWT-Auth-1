const userModel = require('../models/user')
const bcrypt = require('bcrypt')

class UserController {
    static saveUser(username, password) {
        bcrypt.hash(password, 10, function (err, hash) {
            let userModelInstance = new userModel({ username: username, password: hash })
            userModelInstance.save((err, docs) => {
                if (err) throw err
            })
        })
    }
    static isNameFree(username, cb) {
        userModel.find({ username: username }, (err, docs) => {
            cb(docs.length > 0 ? false : true)
        })
    }
    static login(username, password, cb) {
        userModel.findOne({ username: username }, (err, docs) => {
            if (docs) {
                bcrypt.compare(password, docs.password, function (err, res) {
                    cb(res)
                });
            }
            else {
                cb(false)
            }
        })
    }
}

module.exports = UserController