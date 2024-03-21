const knex = require("knex")(require("../knexfile"));

const postuser = async(req, res)=>{
    if(!req.body.username){
        return res.status(400).json({error: {message: "Please provide username"}});
    }
    try {
        const insert = await knex("user").insert(req.body);
        const inserted_user = await knex("user").where({"id": insert[0]});
        return res.status(201).json(inserted_user);
    } catch (error) {
        return res.status(500).json({error: {message: `Can't post user ${error}`}});
    }
}

module.exports = {postuser}