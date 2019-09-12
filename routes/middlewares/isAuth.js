var cookie = require('cookie')

let isAuth = (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '')
    if (cookies.username) {
        next()
    }
    else {
        res.redirect('/login')
    }
}

module.exports = isAuth