const knex = require("knex")(require("../knexfile"));
require("dotenv").config();

const NLPCloudClient = require('nlpcloud');


const tailorResume = async (req, res)=>{
    try {
        const user_id = req.params.userid;
        const foundResume = await knex("resume")
            .where("user_id", user_id);
        let resume = foundResume[0];
        if(!resume){
            return res.json({message: "no resume"});
        }
        // get full resume
        const resume_id = resume.id;
        const linkrows = await knex("link").where("resume_id", resume_id);
        const educationrows = await knex("education").where("resume_id", resume_id);
        const experiencerows = await knex("experience").where("resume_id", resume_id);
        const projectrows = await knex("project").where("resume_id", resume_id);
        // get keywords array
        const {jd}=req.body;
        // const keywords = await getKeywords(jd);
        const keywords = ["Bachelor's degree","Computer Science","Engineering","Full Stack Developer","PHP","Laravel framework","HTML","CSS","JavaScript","Vue.js","MySQL","Git","GitLab","Docker","software development lifecycle","Agile methodologies","problem-solving","communication skills"];

        // tailor experience
        const test = "Utilized React, HTML, Css, and Sass to create a responsive front-end, enhancing user experience across all screen sizes."
        return res.json(calcScore(test, keywords));

    } catch (error) {
        return res.status(500).json({error: {message:`Can not tailor resume: ${error}`}})
    }
    
}
function calcScore(sentence, keywords){
    let score = 0;
    for(const word of keywords){
        if(new RegExp(word,'i').test(sentence)) score++;
    }
    return score;
}
async function getKeywords(jd){
    const client = new NLPCloudClient({model:'dolphin',token:process.env.TOKEN,gpu:true});
    try {
        const message = jd.replaceAll("\n", " ");
        
        const response = await client.kwKpExtraction({text:message});
        return response.data["keywords_and_keyphrases"];
    } catch (error) {
        console.error(error);
    }
}

module.exports = {tailorResume};