const cookie = require('cookie')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies.authToken
    if (!token) return res.redirect('/login')
    if (!jwt.verify(token, 'Some key')) return res.redirect('/login')
    req.user = jwt.verify(token, 'Some key')
    next()
}
