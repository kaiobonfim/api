const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/api").then(() => {
    console.log("Connected to MongoDB...")
}).catch((err) => {
    console.log("Error trying to connect to MongoDB: " + err)
})

module.exports = mongoose