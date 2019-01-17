var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
    category : String,
    email : {
        type : String,
        unique : false
    },
    description : String,
    priority : String,
    date : String,
    progress : Number,
})

mongoose.model('Profile', profileSchema);

module.exports = mongoose.model('Profile');