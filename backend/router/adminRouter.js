const express = require('express')
const multer = require('multer')
const fs = require('fs')
const client = require('../connection')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const authenticate = require('../adminTokenVerification')
const { log } = require('console')

const router = express.Router()
router.use(bodyParser.json({ limit: '50mb' }))
router.use(authenticate)

const upload = multer({
    dest: 'uploads/', limits: {
        fileSize: 50000000 // 50MB limit
    },
})


router.get('/get', (req, res) => {

    const sqlQuery = `SELECT * FROM users_info`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            return res.send(result.rows)
        }
        else {
            console.log(err.message);
        }
    })
    client.end;
})

router.get('/productList', (req, res) => {
    console.log('Hello');
    const sqlQuery = `SELECT * FROM product_info`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            console.log('not error');
            res.send(result.rows)
        }
        else {
            console.log('Error');
            console.log(err.message);
        }
    })
})

router.post('/addProduct', upload.single('product_image'), async (req, res) => {
    console.log('Hello');
    const file = req.file
    console.log(file.path);
    const data = JSON.parse(req.body.formData)
    try {
        const imageBuffer = fs.readFileSync(file.path);
        await client.query("BEGIN")
        const sqlQuery = `INSERT INTO product_info(product_id, product_name, product_image, price, product_desc, keyword1, keyword2, keyword3, stock, mrp, discount_per)
        VALUES (uuid_generate_v4(), '${data.product_name}', $1, ${data.price}, '${data.product_desc}', '${data.keyword1}', '${data.keyword2}', '${data.keyword3}', ${data.stock}, ${data.mrp}, ${data.discount_per})`
        const { rows } = await client.query(sqlQuery, [imageBuffer]);
        await client.query("COMMIT")
        return res.send("Insertion Successfull")
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.log(err);
        console.log('Error');
        res.send("Error while submitting")
    }
})

router.get('/productDetail/:product_id', (req, res) => {
    const id = req.params.product_id
    const sqlQuery = `SELECT * FROM product_info WHERE product_id = '${id}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            res.send(result.rows[0])
        }
        else {
            console.log(err.message);
        }
    })
    client.end
})

router.put('/updateProduct', upload.single('product_image'), async (req, res) => {
    const file = req.file
    console.log(file);
    const data = JSON.parse(req.body.formData)
    console.log(data);
    try {
        // let sqlQuery;
        if (file) {
            const imageBuffer = fs.readFileSync(file.path);
            await client.query("BEGIN")
            // const sqlQuery = `INSERT INTO product_info(product_id, product_name, product_image, price, product_desc, keyword1, keyword2, keyword3, stock, mrp, discount_per)
            // VALUES (uuid_generate_v4(), '${data.product_name}', $1, ${data.price}, '${data.product_desc}', '${data.keyword1}', '${data.keyword2}', '${data.keyword3}', ${data.stock}, ${data.mrp}, ${data.discount_per})`
            const sqlQuery = `UPDATE product_info SET product_name = '${data.product_name}', product_image = $1, price='${data.price}', product_desc='${data.product_desc}', 
            keyword1 = '${data.keyword1}', keyword2 = '${data.keyword2}', keyword3= '${data.keyword3}', stock=${data.stock}, mrp=${data.mrp}, discount_per=${data.discount_per} 
            WHERE product_id = '${data.product_id}'`
            const { rows } = await client.query(sqlQuery, [imageBuffer]);
            await client.query("COMMIT")
            return res.send("Update Successfull")
        }
        else {
            const sqlQuery = `UPDATE product_info SET product_name = '${data.product_name}', price='${data.price}', product_desc='${data.product_desc}', 
            keyword1 = '${data.keyword1}', keyword2 = '${data.keyword2}', keyword3= '${data.keyword3}', stock=${data.stock}, mrp=${data.mrp}, discount_per=${data.discount_per} 
            WHERE product_id = '${data.product_id}'`
            const { rows } = await client.query(sqlQuery);
            await client.query("COMMIT")
            return res.send("Update Successfull")
        }

    }
    catch (err) {
        await client.query("ROLLBACK");
        console.log(err);
        console.log('Error');
        res.send("Error while updating")
    }
})

// router.put('/updateProduct', (req, res) =>{
//     const data = JSON.parse(req.body.formData)
// })

module.exports = router