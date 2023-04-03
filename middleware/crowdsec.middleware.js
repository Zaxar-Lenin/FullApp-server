const expressCrowdsecBouncer = require("@crowdsec/express-bouncer");
require('dotenv').config();

async function crowdsecMiddleware (){
    return await expressCrowdsecBouncer({
            url: "http://192.168.0.102:8080",
            apiKey: process.env.API_KEY,
        })
} ;

module.exports = crowdsecMiddleware
