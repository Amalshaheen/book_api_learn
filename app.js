const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })


console.log(process.env)

const express = require("express")
const morgan = require('morgan')

const bookRouter = require('./routes/booksRoute')


const app = express()


app.use(express.json())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/books', bookRouter)


module.exports = app



