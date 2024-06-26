const knex = require("knex")(require("../knexfile"));

/*
example request 
{"name": "1", "role": "2", "phone_number": "3",
 "email": "4", "summary": "5", "skills": "6", 
 "links": [{"link": "7"}], "educations": [{"title": "8", "subtitle": "8"}],
  "experiences":[{"title": "9", "subtitle": "9", "bullet_points": "9"}], 
  "projects":[{"title": "10", "subtitle": "10", "bullet_points": "10"}]}
*/

function resumeValidator(req, res, next){
    const fields = ["name", "role", "phone_number", "email", "summary", "skills", "links", "educations", "experiences", "projects"];
    if(!fields.every((field) => req.body[field])){
        return res.status(400).json({error: {message: "The request missed some fields"}});
    }
    for(let i = 6; i < fields.length; i++){
        const cur = req.body[fields[i]];
        if(!cur.length){
            return res.status(400).json({error: {message: "The request missed some fields"}});
        }
        for(const curItem of cur){
            if(i === 6){
                if(!curItem["link"]) return res.status(400).json({error: {message: `Your ${fields[i]} don't have a link address`}});
            }
            if(i > 6){
                if(!curItem["title"]) return res.status(400).json({error: {message: `Your ${fields[i]} don't have a title`}});
                if(!curItem["subtitle"]) return res.status(400).json({error: {message: `Your ${fields[i]} don't have a subtitle`}});
            }
            if(i > 7){
                if(!curItem["bullet_points"]) return res.status(400).json({error: {message: `Your ${fields[i]} don't have a bullet_points`}});
            }
        }
        
    }
    next();
}

function useridValidator(req, res,next){
    const user_id = req.params.userid;
    const matchid = async()=>{
        const foundUser = await knex('user').where('id', user_id);
        if(!foundUser.length){
            return res.status(400).json({ error: `The user with id ${user_id} doesn't exist!` });
        }
        next();
    }
    matchid();
}

module.exports = {resumeValidator, useridValidator};