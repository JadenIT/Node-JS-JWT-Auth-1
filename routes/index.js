const router = require('express').Router()
const UserController = require('../controllers/user')
var cookie = require('cookie')
const clearErrors = require('./middlewares/cleanErrors')
const isAuth = require('./middlewares/isAuth')

router.route('/')
    .get(isAuth, (req, res) => {
        var cookies = cookie.parse(req.headers.cookie || '');
        res.render('pug/index.pug', { username: cookies.username })
    })

router.route('/login')
    .get(clearErrors, (req, res) => {
        let cookies = cookie.parse(req.headers.cookie || '')
        res.render('pug/login.pug', { error: cookies.loginError })
    })

    .post((req, res) => {
        let { Username, Password } = req.body
        if (Username.trim().length == 0 || Password.trim().length == 0) {
            res.setHeader('Set-Cookie', cookie.serialize('loginError', `Inputs can't be empty`))
            res.redirect(req.url)
        }
        else {
            UserController.login(Username, Password, (result) => {
                switch (result) {
                    case true:
                        res.setHeader('Set-Cookie', cookie.serialize('username', Username, { maxAge: 60 * 60 * 24 * 7 }))
                        res.redirect('/')
                        break
                    case false:
                        res.setHeader('Set-Cookie', cookie.serialize('loginError', 'Incorrect username or password'))
                        res.redirect('/login')
                        break
                }
            })
        }
    })

router.route('/register')
    .get(clearErrors, (req, res) => {
        let cookies = cookie.parse(req.headers.cookie || '')
        res.render('pug/register.pug', { error: cookies.registerError })
    })

    .post((req, res) => {
        let { Username, Password, Password2 } = req.body
        if (Username.trim().length == 0 || Password.trim().length == 0 || Password2.trim().length == 0) {
            res.setHeader('Set-Cookie', cookie.serialize('registerError', `Inputs can't be empty`))
            res.redirect(req.url)
        }
        else {
            if (Password == Password2) {
                UserController.isNameFree(Username, (result) => {
                    switch (result) {
                        case true:
                            UserController.saveUser(Username, Password)
                            res.redirect('/login')
                            break
                        case false:
                            res.setHeader('Set-Cookie', cookie.serialize('registerError', `Username ${Username} is taken`))
                            res.redirect('/register')
                            break
                    }
                })
            }
            else {
                res.setHeader('Set-Cookie', cookie.serialize('registerError', 'Passwords do not match!'))
                res.redirect('/register')
            }
        }
    })

router.route('/logout')
    .post((req, res) => {
        res.setHeader('Set-Cookie', cookie.serialize('username', '', { expires: new Date() }))
        res.redirect('/')
    })

module.exports = router