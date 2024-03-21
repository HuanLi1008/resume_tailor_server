const knex = require("knex")(require("../knexfile"));
const postresume = async(req, res)=>{
    try {
        const {name, role, phone_number, email, summary, skills, links, educations, experiences, projects} = req.body;
        const insert_user = await knex("user").insert({name:name, role:role, phone_number:phone_number, email:email});
        const user_id = insert_user[0];
        const insert_resume = await knex("resume").insert({user_id:user_id, summary:summary, skills:skills});
        const resume_id = insert_resume[0];
        const restTables = {"link": links, "education": educations, "experience": experiences, "project": projects};
        for(const key in restTables){
            const arr = restTables[key];
            for(const obj of arr){
                await knex(key).insert({resume_id: resume_id, ...obj});
            }
        }
        const resumeObj = {...req.body, user_id: user_id, resume_id: resume_id};
        return res.status(201).json(resumeObj)
    } catch (error) {
        return res.status(500).json({error: {message: `can not post resume ${error}`}});
    }
    
}
const getresume = async(req, res)=>{
    try {
        return res.status(200).json("This is getting resume endpoint");
    } catch (error) {
        
    }
}

module.exports = {postresume, getresume};