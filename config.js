require('dotenv').config()

const uri = process.env.MONGO_DB_URI

module.exports = {
    uri
}