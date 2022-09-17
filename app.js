const express = require("express")
const mongoose = require("mongoose")
const app = express()
const PORT = 8080
const auth = require("./controllers/authController")
const champions = require("./controllers/championsController")

app.use(express.urlencoded({extended: false}))
app.use(express.json())



app.use("/auth", auth)
app.use("/champions", champions)


app.listen(PORT, () => {
    console.log("Server running on port " + PORT + "...")
})