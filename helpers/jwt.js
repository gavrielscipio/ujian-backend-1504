const jwt = require('jsonwebtoken')
const TOKEN_KEY = '!@#$%^&*'

module.exports = {
    createToken : (data) => {
        return jwt.sign(data, TOKEN_KEY)
    },

    verifyToken : (req, res, next) => {
        const token = req.body.token 
        console.log('ini token sebelum verify:', token)

        // check if token exist, ini dibuat karna keeplogin tetap akan berjalan saat belum login
        if (!token) return res.status(400).send('no token') // bila error, akan di tangkap di frontend bagian catch (err)

        try {
            // verify token
            const result = jwt.verify(token, TOKEN_KEY)
            console.log('result verify token :', result)

            //add token to req.user
            req.user = result

            //lanjut ke proses berikutnya
            next()
        }
        catch(err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}