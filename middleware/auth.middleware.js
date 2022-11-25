const config = require('config')
const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    if(req.method === "OPTIONS"){
        return next();
    }

    try{
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        if(!token){
          return res.status(401).json({message: "Auth error" })
        }
        const decoded = jwt.verify(token,config.get("server-key"))
        console.log(decoded)
        req.user = decoded
        next()
    }catch(e){
           return res.status(401).json({message: "Auth error" })
    }
}

module.exports = auth