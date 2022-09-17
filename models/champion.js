const mongoose = require("../database/mongo")

const championSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true, 
        uppercase: true
    }, 
    role: {
        type: String, 
        required: true,
        uppercase: true
    }, 
    isFavorite: {
        type: Number, 
        default: 0
    }
})

const Champion = mongoose.model("champions", championSchema)
module.exports = Champion