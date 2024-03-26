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
        const {jd}=req.body;
        // const keywords = await getKeywords(jd);
        const keywords = ["Bachelor's degree","Computer Science","Engineering","Full Stack Developer","PHP","Laravel framework","HTML","CSS","JavaScript","Vue.js","MySQL","Git","GitLab","Docker","software development lifecycle","Agile methodologies","problem-solving","communication skills"];
        
        
    } catch (error) {
        
    }
    res.send('This is tailor page')
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