var mongoose = require('mongoose');

var loginSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    contact : Number,
    gender : String
})

mongoose.model('Login', loginSchema);

module.exports = mongoose.model('Login');