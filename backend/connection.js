const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: process.env.pswrd,
    port: 5432,
    database: 'shopcart'
})

module.exports = client