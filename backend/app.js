const express = require('express')
require('dotenv').config()
const client = require('./connection.js')
const cors = require('cors')

const loginRouter = require('./router/loginRouter.js')
const userRouter = require('./router/userRouter.js')
const adminRouter = require('./router/adminRouter.js')

const app = express()
const corsOptions = {
    origin: "*"
}
client.connect((err) =>{
    if(!err){
        console.log('Database Connected');
    }
})

app.use(cors(corsOptions))
app.use('/login', loginRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)













const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server listening at Port no.: ${port}`);
})