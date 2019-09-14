const router = require('express').Router()
const UserController = require('../controllers/user')
const cookie = require('cookie')
const clearErrors = require('./middlewares/cleanErrors')
const auth = require('./middlewares/auth')
const jwt = require('jsonwebtoken')
const cookies = require('./middlewares/cookies')

router.route('/')
    .get(auth, cookies, (req, res) => {
        res.render('pug/index.pug', { username: req.user.Username })
    })

router.route('/login')
    .get(clearErrors, cookies, (req, res) => {
        res.render('pug/login.pug', { error: req.cookies.loginError })
    })

    .post((req, res) => {
        let { Username, Password } = req.body
        if (Username.trim().length == 0 || Password.trim().length == 0) {
            res.setHeader('Set-Cookie', cookie.serialize('loginError', `Inputs can't be empty`))
            res.redirect(req.url)
        }
        else {
            UserController.login(Username, Password, (result) => {
                if (!result) {
                    res.setHeader('Set-Cookie', cookie.serialize('loginError', 'Incorrect username or password'))
                    res.redirect('/login')
                }
                else {
                    const token = jwt.sign({ Username: Username }, 'Some key')
                    res.setHeader('Set-Cookie', cookie.serialize('authToken', token, { maxAge: 60 * 60 * 24 * 7 }))
                    res.redirect('/')
                }
            })
        }
    })

router.route('/register')
    .get(clearErrors, cookies, (req, res) => {
        res.render('pug/register.pug', { error: req.cookies.registerError })
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
                    if (!result) {
                        res.setHeader('Set-Cookie', cookie.serialize('registerError', `Username ${Username} is taken`))
                        res.redirect('/register')
                    }
                    else {
                        UserController.saveUser(Username, Password)
                        res.redirect('/login')
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
        res.setHeader('Set-Cookie', cookie.serialize('authToken', '', { expires: new Date() }))
        res.redirect('/')
    })

module.exports = router