const User = require("../models/User")
const Router = require('express')
const router = new Router
const config = require('config')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth.middleware')
const {check,validationResult} =require('express-validator')
const bcrypt = require("bcryptjs")

router.post("/registration",
    [
        check("email","Uncorrect email").isEmail(),
        check("password", "Password must contain if only 1 symbol").isLength({min:1}),
        check("name", "Uncorrect name").isLength({min:1,max:34})
    ], async (req,res) => {
    try {
    console.log(req.body)
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.errors[0].msg})
        }

        const {email,password, name} = req.body

        const candidate = await User.findOne({email})

        if(candidate){
             return res.status(400).json({message: `User with email ${email} already exist`})
        }

        const hashPassword = await bcrypt.hash(password,8)
        const date = new Date();
        const dataRegistration = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        const dataLogin = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        const user = new User({email, password: hashPassword,name,dataRegistration,dataLogin})
        await user.save()
        return res.json({message: "User was created", dataUser: {email,password}})
    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )

router.post("/login",
   async (req,res) => {
    try {

        const {email , password} = req.body

        console.log(req.body)

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({
                message: "User no found"
            })
        }

        const isPassValid = bcrypt.compareSync(password,user.password)

        if(!isPassValid){
            return res.status(400).json({
                message: 'Invalid password'
            })
        }

        const filter = { email };

        const date = new Date();
        const dataLogin = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        const update = { dataLogin };

        const newUser = await User.findOneAndUpdate(filter, update);

        await newUser.save()

        const token = jwt.sign({id: user.id}, config.get("server-key"),{expiresIn: "1h"})

        return res.json({
            token,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            status: newUser.status
        })
    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )


router.get("/auth",
    authMiddleware,
   async (req,res) => {
    try {
          const user = await User.findOne({_id: req.user.id})

          if(!user){
          res.status(404).json({message: "Не авторизован"})
          }

          const token = jwt.sign({id: user.id}, config.get("server-key"),{expiresIn: "1h"})

          return res.json({
                    token,
                    id:  user._id,
                    name: user.name,
                    email: user.email,
                    status: user.status
          })
    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )

router.get("/users",
   async (req,res) => {
    try {
          const users = await User.find({}).exec(function (err, users) {
                   const improveUsers =  users.map(m => ({
                        id: m._id,
                        name: m.name,
                        email: m.email,
                        dataRegistration: m.dataRegistration,
                        dataLogin: m.dataLogin,
                        status: m.status,
                   }))
                  res.json({user: improveUsers})
          })

    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )

router.put("/users",
   async (req,res) => {
    try {
          const {listId, status} = req.body

          listId.map(async (m)=> {
                     await User.findOneAndUpdate({_id: m}, {status});
          })
          res.json({message: "OOOK"})
    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )

router.delete("/users/:listId",
   async (req,res) => {
    try {
          const listId = req.params.listId.split(',')
          listId.map(async (m)=> {
                    await User.findOneAndRemove({_id: m});
          })
          res.json({message: "User remove"})
    }catch(e){
        console.log(e)
        res.send({message: "Server error"})
    }
} )

module.exports = router