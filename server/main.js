const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser");
const port = 3000

const exceptionMiddleware = require('./router/exception')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/api', require('./router/router'))

app.use(exceptionMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})