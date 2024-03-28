const knex = require("knex")(require("../knexfile"));

const findUserByName = async(username) =>{
    const foundUser = await knex("user").where("username", username);
    return foundUser[0];
}
const postuser = async(req, res)=>{
    const username = req.body.username;
    try {
        const foundUser = await findUserByName(username);
        
        if(foundUser){
            return res.status(409).send({error: { message: 'Username already exists.' }});
        }
        const insert = await knex("user").insert(req.body);
        const inserted_user = await knex("user").where({"id": insert[0]});
        return res.status(201).json(inserted_user[0]);
    } catch (error) {
        return res.status(500).json({error: {message: `Can't post user ${error}`}});
    }
}

const finduser = async(req, res)=>{
    const username = req.params.username;
    if(!username){
        return res.status(400).json({error: {message: "Please provide username"}});
    }
    try {
        const user = await findUserByName(username);
        
        if(!user){
            return res.status(404).send({ message: 'Username does not exist.' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({error: {message: `Can't find user ${error}`}});
    }

}

module.exports = {postuser, finduser}