const knex = require("knex")(require("../knexfile"));

function createUserValidator(req, res, next){
    const username = req.body.username;
    if(!username){
        return res.status(400).json({error: {message: "Please provide username"}});
    }
    next();
}

module.exports = {createUserValidator}