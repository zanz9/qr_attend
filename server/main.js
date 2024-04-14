const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser");
const port = 3000

require('dotenv').config()

const exceptionMiddleware = require('./router/exception')
const path = require("path");

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use('/', express.static(path.resolve(__dirname, 'dist')))

app.use('/api', require('./router/router'))

app.use(exceptionMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})