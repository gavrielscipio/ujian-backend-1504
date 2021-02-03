const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
require('dotenv').config()

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())

// set up database my sql
const db = require('./database')
db.connect((err) => {
    if(err) return console.error('error conneccting: ' + err.stack)

    console.log('connected to mysql as id ' + db.threadId )
})

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

const { userRouter, moviesRouter } = require('./routers')
app.use('/user', userRouter)
app.use('/movies', moviesRouter)

// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)