var cookie = require('cookie')

let clearErrors = (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '')
    if (cookies.loginError) {
        res.setHeader('Set-Cookie', cookie.serialize('loginError', '', { expires: new Date() }))
    }
    if (cookies.registerError) {
        res.setHeader('Set-Cookie', cookie.serialize('registerError', '', { expires: new Date() }))
    }
    next()
}

module.exports = clearErrors