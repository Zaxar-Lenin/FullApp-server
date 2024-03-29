const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const cors = require('cors')
const userRouter = require('./routers/auth.router')
const corsMiddleware = require("./middleware/cors.middleware")
require('dotenv').config();
const app = express()
const bodyParser = require("body-parser");
const crowdsecMiddleware = require("./middleware/crowdsec.middleware")


// const corsOptions ={
//     origin:['https://zaxar-lenin.github.io'],
//     credentials:true,
//     optionSuccessStatus:200,
//     methods: ['GET','PUT','POST','DELETE'],
// }

//  const crowdsecMiddleware = await expressCrowdsecBouncer({
//     url: "http://localhost:8080",
//     apiKey: "BOUNCER_API_KEY",
//   });


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(crowdsecMiddleware);
app.use(express.json())
app.use("/api/auth", userRouter)

const port = process.env.PORT || 5000

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL)

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    }catch(e){
        throw new Error(e)

        console.log(e)
    }
}

start()