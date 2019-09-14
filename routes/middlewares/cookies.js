const cookie = require('cookie')

module.exports = (req, res, next) => {
    req.cookies = cookie.parse(req.headers.cookie || '')
    next()
}