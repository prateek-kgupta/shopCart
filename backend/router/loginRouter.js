const express = require('express')
const jwt = require('jsonwebtoken')
const client = require('../connection')
const bodyParser = require('body-parser')

const router = express.Router()
router.use(bodyParser.json())

require('dotenv').config();

router.post('/', (req, res) => {
    const { email, password } = req.body;

    client.query(`SELECT password,role,firstname,lastname FROM users_info WHERE email='${email}'`, (err, result) => {
        if (!err) {
            if (result.rows[0] && result.rows[0].password === password) {
                const token = jwt.sign({email,role:result.rows[0].role},process.env.SECRET_KEY)
                const sendItems = {
                    role: result.rows[0].role,
                    firstname: result.rows[0].firstname,
                    lastname: result.rows[0].lastname,
                    token: token
                }
                res.send(sendItems)
            }
            else {
                res.send('Invalid Credentials')
            }
        }
        else {
            console.log(err.message);
        }
    })
    client.end;
})


router.post('/post', (req, res) => {
    const userData = req.body;
    console.log(userData);
    client.query(`SELECT * FROM users_info WHERE email='${userData.email}'`, (err, result)=>{
        if(!err){
            if(result.rows[0]){
                return res.send('Email already in use')
            }
        }
    })
    client.end;
    const sqlQuery = `INSERT INTO users_info (firstname, lastname, email, password, address, contact) 
    VALUES ('${userData.firstname}', '${userData.lastname}', '${userData.email}', '${userData.password}', '${userData.address}', '${userData.contact}'  )`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            console.log(result);
            return res.send('Insertion successfull')
        }
        else {
            return res.send('Username already taken')
        }
    })
    client.end;
})

router.get('/userType/:email', (req, res)=>{
    console.log(req.params.email)
    client.query(`SELECT role FROM users_info WHERE email='${req.params.email}'`, (err, result)=>{
        if(!err){
            console.log(result.rows);
            return res.send(result.rows[0].role)
        }
    })
    client.end
})
module.exports = router