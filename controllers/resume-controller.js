const knex = require("knex")(require("../knexfile"));
const postresume = async(req, res)=>{
    try {
        const user_id = req.params.userid;
        const {name, role, phone_number, email, summary, skills, links, educations, experiences, projects} = req.body;
        
        const insert_resume = await knex("resume").insert({
            user_id:user_id, 
            name:name, 
            role:role, 
            phone_number:phone_number, 
            email:email, 
            summary:summary, 
            skills:skills});
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
        const user_id = req.params.userid;
        const foundResume = await knex("resume")
            .where("user_id", user_id);
        let resume = foundResume[0];
        if(!resume){
            return res.json({message: "no resume"});
        }
        const resume_id = resume.id;
        const linkrows = await knex("link").where("resume_id", resume_id);
        const educationrows = await knex("education").where("resume_id", resume_id);
        const experiencerows = await knex("experience").where("resume_id", resume_id);
        const projectrows = await knex("project").where("resume_id", resume_id);
        resume = {...resume, links: linkrows, educations: educationrows, experiences: experiencerows, projects: projectrows};
        return res.json(resume);
    } catch (error) {
        return res.status(500).json({error: {message: `Can not get resume ${error}`}});
    }
}

module.exports = {postresume, getresume};