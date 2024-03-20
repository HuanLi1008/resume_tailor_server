const knex = require("knex")(require("../knexfile"));
const postresume = (req, res)=>{
    res.send('this is resume page')
}

module.exports = {postresume};