const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authConfig = require("../config/auth.json")
const { secureHeapUsed } = require("crypto")

router.post("/register", async (req, res) => {
    const {email} = req.body
    try {
        if(await User.findOne({email}))
            return res.status(400).send({error: "Email already in use"})
        const user = await User.create(req.body)
        user.password = undefined
        user.createdAt = undefined
        user.__v = undefined
        return res.send({user})
    } catch (err) {
        return res.status(400).send({error: "Registration failed."})
    }
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email}).select("+password")
    if (!user)
        return res.status(400).send({error: "User not found"})
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: "Invalid password"})
    user.password = undefined
    user.createdAt = undefined
    user.__v = undefined
    const token = jwt.sign({id: user.id}, authConfig.secret, {
        expiresIn: 86400
    })
    res.send({user, token})
})

module.exports = router