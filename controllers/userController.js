const db = require('../database')
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

// import validationResult from express validator
const { validationResult } = require('express-validator')

const cryptojs = require('crypto-js')
const secret_key = '!@#$%^&*'

const { createToken } = require('../helpers/jwt')

module.exports = {

    register : async (req, res) => {
        const { username, email, password, role } =  req.body
        const uid = Date.now()
        
        const validation = validationResult(req)
        if (!validation.isEmpty()) return res.status(400).send(validation.array().map(i => i.msg))
        
        const hashPass = cryptojs.HmacMD5(password, secret_key).toString()

        try{
            const checkUser = `SELECT * FROM users
                               WHERE username = ${db.escape(username)}
                               OR email = ${db.escape(email)}`
            const result = await asyncQuery(checkUser)
            if(result.length !== 0) return res.status(400).send('username or email is already exist')
            
            
            const queryRegister = `INSERT INTO users (username, password, email, uid, role)
                                   VALUES (${db.escape(username)}, ${db.escape(hashPass)}, ${db.escape(email)}, ${db.escape(uid)}, ${db.escape(role)})`
            const resultReg = await asyncQuery(queryRegister)
            
            
            const getUser = `SELECT id, uid, username, email FROM users
                             WHERE id = ${resultReg.insertId}`
            const resultGet = await asyncQuery(getUser)
            
            
            const newToken = createToken({uid: uid, role: resultGet.role})
            resultGet[0].token = newToken

            res.status(200).send(resultGet[0])
        }
        catch (err) {
            res.status(400).send(err)
            console.log(err)
        }
    },

    login : async (req, res) => {
        const { username, email, password } = req.body

        const hashpass = cryptojs.HmacMD5(password, secret_key).toString()

        try {
            const queryLogin = `SELECT  id, uid, username, email, status, role FROM users
                                WHERE username = ${db.escape(username)}
                                OR email = ${db.escape(email)}
                                AND password = ${db.escape(hashpass)}`
            const result = await asyncQuery(queryLogin)

            if (result[0].status == 2) return res.status(400).send('Akunmu sudah di deactive')
            if (result[0].status == 3) return res.status(400).send('Akunmu sudah di closed')

            const newToken = createToken({uid: result[0].uid, role: result[0].role})
            result[0].token = newToken

            res.status(200).send(result[0])
        }
        catch (err) {
            res.status(400).send(err)
            console.log(err)
        }
    },

    deactive : async (req, res) => {

        try {
            const queryDeactive = `UPDATE users SET status = 2
                                   WHERE uid = ${req.user.uid}`
            const result = await asyncQuery(queryDeactive)

            const getQuery = `SELECT uid, status FROM users
                              WHERE uid = ${req.user.uid}`
            const result2 = await asyncQuery(getQuery)

            res.status(200).send(result2[0])
        }
        catch (err) {
            res.status(400).send(err)
            console.log(err)
        }
    },

    activate : async (req, res) => {

        try {
            const checkUser = `SELECT * FROM users
                               WHERE uid = ${db.escape(req.user.uid)}`
            const result = await asyncQuery(checkUser)

            if (result[0].status == 3) return res.status(400).send('maaf akunmu sudah di closed')

            const queryActivate = `UPDATE users SET status = 1
                                   WHERE uid = ${req.user.uid}`
            const result2 = await asyncQuery(queryActivate)

            const getQuery = `SELECT uid, status FROM users
                              WHERE uid = ${req.user.uid}`
            const result3 = await asyncQuery(getQuery)

            res.status(200).send(result3[0])
        }
        catch (err) {
            res.status(400).send(err)
            console.log(err)
        }
    },

    closed : async (req, res) => {
        try {
            
            const queryClose = `UPDATE users SET status = 3
                                WHERE uid = ${req.user.uid}`
            const result = await asyncQuery(queryClose)

            const getQuery = `SELECT uid, status FROM users
                              WHERE uid = ${req.user.uid}`
            const result2 = await asyncQuery(getQuery)

            res.status(200).send(result2[0])
        }
        catch (err) {
            res.status(400).send(err)
            console.log(err)
        }
    }
}
