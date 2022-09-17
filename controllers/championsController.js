const express = require("express")
const authMiddleware = require("../middlewares/auth")
const Champion = require("../models/champion")
const router = express.Router()

router.use(authMiddleware)

router.post("/", async (req, res) => {
    try {
        const {name, role} = req.body
        if (!name || typeof name == null || name == undefined)
            return res.status(400).send({error: "Champion name cannot be empty"})
        if (!role || typeof role == null || role == undefined)
            return res.status(400).send({error: "Champion role cannot be empty"})
        if (role == "top" || role == "jungle" || role == "mid" || role == "adc" || role == "support"){
            const champion = await Champion.create(req.body)
            return res.send({champion})
        } else
            return res.status(400).send({error: "Champion role is invalid"})
    } catch(err) {
        res.status(400).send({error: "An error has occured while trying to create the champion: " + err})
    }
})

router.get("/", async (req, res) => {
    try {
        if (req.query.name){
            const champion = await Champion.findOne({name: req.query.name}).select("-__v")
            res.send({champion})
        } else if (req.query.role) {
            const champions = await Champion.find({role: req.query.role}).select("-__v")
            res.send({champions})
        } else {
            const champions = await Champion.find().populate().select("-__v")
            res.send({champions})
        }       
    } catch(err) {
        res.status(400).send({error: "An error has occured while trying to list champions: " + err})
    }
})

router.get("/favorite/:id", async (req, res) => {
    try {
        const champion = await Champion.findById({_id: req.params.id}).select("-__v")
        if(champion.isFavorite == 0){
            champion.isFavorite = 1
            await champion.save()
            res.send({champion})
        } else {
            champion.isFavorite = 0
            await champion.save()
            res.send({champion})
        }
    } catch(err) {
        res.status(400).send({error: "Invalid id: " + err})
    }    
})

router.get("/favorite", async (req, res) => {
    try {
        if (req.query.name){
            const champion = await Champion.findOne({name: req.query.name}).select("-__v")
            if(champion.isFavorite == 0){
                champion.isFavorite = 1
                await champion.save()
                res.send({champion})
            } else {
                champion.isFavorite = 0
                await champion.save()
                res.send({champion})
            }
        }
    } catch(err) {
        res.status(400).send({error: "Invalid id: " + err})
    }    
})

router.get("/favorites", async (req, res) => {
    try { 
        const champions = await Champion.find({isFavorite: 1}).select("-__v")
        res.send({champions})
    } catch(err) {
        res.status(400).send({error: "An error has occured while trying to list favorites"})
    }
})

router.get("/:id", async (req, res) => {
    try {
        const champion = await Champion.findOne({_id: req.params.id}).select("-__v")
        res.send({champion})
    } catch(err) {
        res.status(400).send({error: "Invalid id" + err})
    }
})

router.put("/:id", async (req, res) => {
    try {
        const {name, role} = req.body
        const champion = await Champion.findByIdAndUpdate(req.params.id, {
            name, 
            role
        }, {new: true}).select("-__v")
        champion.save()
        return res.send({champion})
    } catch (err) {
        res.status(400).send({error: "An error has occured while updating the champion: " + err})
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Champion.findByIdAndDelete(req.params.id)
        return res.send({ok: "Deleted successfully"})
    } catch(err) {
        res.status(400).send({error: "An error has occured while deleting the champion: " + err})
    }
})

module.exports = router