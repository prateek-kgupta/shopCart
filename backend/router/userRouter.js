const express = require('express')
const client = require('../connection')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const authenticate = require('../verifyToken')
const nodemailer = require('nodemailer')
require('dotenv').config()

const router = express.Router()
router.use(bodyParser.json())
router.use(authenticate)

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'prateek.gpt2014@gmail.com',
        pass: process.env.epas
    }
});

//View Products
router.get('/products', (req, res) => {
    const sqlQuery = `SELECT * FROM product_info WHERE stock <> 0`
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

router.get('/products/:keyword', (req, res) => {
    const keyword = req.params.keyword.toLowerCase()
    const sqlQuery = `SELECT * FROM product_info WHERE (LOWER(keyword1) = '${keyword}' OR LOWER(keyword2) = '${keyword}' 
    OR LOWER(keyword3) = '${keyword}' OR LOWER(product_name) like '% ${keyword}%' OR LOWER(product_name) like '%${keyword} %') AND stock <> 0`
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

router.get('/prodInfo/:product_id', (req, res) => {
    const sqlQuery = `SELECT * FROM product_info WHERE product_id = '${req.params.product_id}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            res.send(result.rows)
        }
        else {
            console.log(err.message);
        }
    })
    client.end
})

router.post('/relatedItems', (req, res) => {
    console.log('Related Items');
    const data = req.body
    const sqlQuery = `SELECT product_id, product_name, product_desc, product_image, price, mrp, discount_per from product_info 
    WHERE product_id <> '${data.id}' AND stock <> 0 AND (LOWER(keyword1) in ('${data.key1}', '${data.key2}', '${data.key3}') OR LOWER(keyword2) in ('${data.key1}', '${data.key2}', '${data.key3}') 
    OR LOWER(keyword3) in ('${data.key1}', '${data.key2}', '${data.key3}'))`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            console.log('Not error');
            res.send(result.rows)
        }
        else {
            console.log('Error');
            console.log(err.message);
        }
    })
    client.end
})

router.post('/addToCart', (req, res) => {
    const { product_id, email } = req.body
    console.log(product_id, email);
    let sqlQuery = `SELECT quantity FROM cart_info WHERE product_id = '${product_id}' 
    AND email = '${email}'`
    var prodQuan = 1
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            console.log(result.rows)
            if (result.rows[0]) {
                console.log('Hello');
                prodQuan += result.rows[0].quantity
                sqlQuery = `UPDATE cart_info SET quantity =${prodQuan} WHERE email = '${email}' 
                AND product_id='${product_id}'`
                client.query(sqlQuery, (err, result) => {
                    if (!err) {
                        return res.send('Product updated in cart')
                    }
                    else {
                        console.log(err.message);
                    }
                })
                client.end
            }
            else {
                sqlQuery = `INSERT INTO cart_info VALUES('${product_id}', '${email}', uuid_generate_v4(), 1)`
                client.query(sqlQuery, (err, result) => {
                    if (!err) {
                        return res.send('Product added to cart')
                    }
                    else {
                        console.log(err.message);
                    }
                })
                client.end
            }
        }
        else {
            console.log(err.message);
        }
    })
    client.end
})

router.get('/cart/:email', (req, res) => {
    const email = req.params.email
    const sqlQuery = `SELECT item_id, quantity, product_name,product_image, address, contact, price, product_info.product_id as product_id
    FROM product_info INNER JOIN cart_info ON product_info.product_id = cart_info.product_id INNER JOIN users_info ON 
    cart_info.email = users_info.email WHERE cart_info.email='${email}';`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            return res.send(result.rows)
        }
        else {
            console.log(err.message)
        }
    })
})

router.put('/alterQuantity', (req, res) => {
    const data = req.body
    console.log(data)
    const sqlQuery = `UPDATE cart_info SET quantity=${data.quantity} WHERE item_id = '${data.item_id}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            return res.send('Updated succesfully')
        }
        else {
            return res.send(err.message)
        }
    })
})

router.post('/checkout/:email', (req, res) => {
    const email = req.params.email
    const products = req.body
    let proceed = true
    for (let i = 0; i < products.length; i++) {
        let product = products[i]
        const sqlQuery = `SELECT stock>=${product.quantity} as availability FROM product_info WHERE product_id = '${product.product_id}'`
        client.query(sqlQuery, (err, result) => {
            if (!err) {
                console.log(result.rows)
                if (!result.rows[0].availability) {
                    proceed = false
                    return res.send(`${product.product_name} exceeds the maximum stock limit`)
                }
            }
            else {
                console.log(err.message)
            }
        })
        client.end
    }
    if (proceed) {
        console.log(products);
        let i;
        let mailtext = `Your order has been placed successfully.\n\nDelivery Address: \n ${products[0].contact} \n ${products[0].address} \n\nOrder Receipt: \n`;
        for (i = 0; i < products.length; i++) {
            let product = products[i]
            let sqlQuery = `INSERT INTO sales_info VALUES ('${product.product_id}', '${email}', 
            ${product.quantity}, ${product.quantity * parseFloat(product.price)}, uuid_generate_v4())`
            client.query(sqlQuery, (err, result) => {
                if (!err) {
                    mailtext = mailtext + `${product.product_name} \t ${product.quantity} \t Rs.${product.quantity * parseFloat(product.price)}\n`
                    console.log('bought', product.quantity, product.product_name)
                }
                else {
                    console.log(err.message);
                }
            })
            client.end;
            sqlQuery = `UPDATE product_info SET stock = stock - ${product.quantity} WHERE product_id = '${product.product_id}'`
            client.query(sqlQuery, (err, result) => {
                if (!err) {
                    console.log('updated stock for', product.product_name)
                }
                else {
                    console.log(err.message);
                }
            })
        }
        if (i === products.length) {
            const sqlQuery = `DELETE FROM cart_info WHERE email = '${email}'`
            client.query(sqlQuery, (err, result) => {
                if (!err) {
                    const mailOptions = {
                        from: 'prateek.gpt2014@gmail.com',
                        to: `${email}`,
                        subject: 'Purchase Receipt from shopCart',
                        text: mailtext
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            return res.send('A purchase receipt has been sent to your email')
                        }
                    });
                }
                else {
                    console.log(err.message);
                }
            })

        }
    }
})

router.get('/orderHistory/:email', (req, res) => {
    console.log('Hello');
    const email = req.params.email
    const sqlQuery = `SELECT product_image, product_info.product_id, product_name, quantity_purchased, price_paid, sale_id FROM product_info 
    INNER JOIN sales_info ON product_info.product_id = sales_info.product_id WHERE email='${email}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            res.send(result.rows)
        }
        else {
            console.log(err.message)
        }
    })
    client.end
})

router.delete('/removeItem/:item_id', (req, res) => {
    const item_id = req.params.item_id
    const sqlQuery = `DELETE FROM cart_info WHERE item_id = '${item_id}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            res.send('Item removed')
        }
        else {
            console.log(err.message)
        }
    })
    client.end
})

router.put('/updateDetails/:email', (req, res) => {
    const data = req.body
    const email = req.params.email
    const sqlQuery = `UPDATE users_info SET address='${data.address}', contact='${data.contact}' WHERE email='${email}'`
    client.query(sqlQuery, (err, result) => {
        if (!err) {
            res.send('Address Updated')
        }
        else {
            res.send(err.message)
        }
    })
})

module.exports = router