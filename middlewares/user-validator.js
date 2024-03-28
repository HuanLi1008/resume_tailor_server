const knex = require("knex")(require("../knexfile"));

function createUserValidator(req, res, next){
    const username = req.body.username;
    if(!username){
        return res.status(400).json({error: {message: "Please provide username"}});
    }
    const userExist = async()=>{
        const foundUser = await knex("user").where("username", username);
        if(foundUser.length){
            return res.status(409).send({ message: 'Username already exists.' });
        }else{
            next();
        }
    }
    userExist();
}

module.exports = {createUserValidator}