const express = require('express')
const router = require('./routes/index')
const bodyParser = require('body-parser')
var app = express()

app.set('veiws', './views')
app.set('view engine', 'pug')
app.use('/', express.static('views'))
app.use(bodyParser.urlencoded({extended: false}))

const PORT = 7000

let server = app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${server.address().port}`)
})

app.use('/', router)