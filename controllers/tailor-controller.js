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
         
        return res.json(tailorObject(experiencerows, keywords));

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
function tailorObject(arr, keywords){
    let map = []
    arr.forEach((cur, i)=>{
        
        const bullet_points=cur.bullet_points;
        const pointsArr = bullet_points.split("\\n");
        const pointsMap = [];
        for(const point of pointsArr){
            const score = calcScore(point, keywords);
            pointsMap.push({point: point, score: score});
        }
        
        let objScore = 0;
        if(pointsArr.length > 3){
            pointsMap.sort((a,b)=> b.score - a.score);
            arr[i].bullet_points = pointsMap.slice(0, 3).map((item) => item.point).join("\\n");
            objScore = pointsMap.slice(0, 3).reduce((a, c) => a + c.score, 0);
            
            
        }else{
            objScore = pointsMap.reduce((a, c)=> a + c.score, 0);
        
        }
        map.push({obj: arr[i], score: objScore});
        
        
    })
    
    map.sort((a, b)=> b.score - a.score);
    
    if(arr.length > 3) map = map.slice(0,3);
    return map.map((i) => i.obj);
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