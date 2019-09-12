const mongoose = require('mongoose')
const config = require('../config')

mongoose.connect(config.uri, {useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if(err) throw err
})

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

let UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel