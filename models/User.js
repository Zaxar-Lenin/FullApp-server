const {Schema, model} = require("mongoose")

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    dataRegistration: {type: String},
    dataLogin: {type: String},
    status: {type: String, default: "unblock"},
})

module.exports = model("User",User)