const knex = require("knex")(require("../knexfile"));
require("dotenv").config();

const NLPCloudClient = require('nlpcloud');
const PDFDocument = require('pdfkit');
const fs = require("fs");
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

        // tailor experience and project
        const tailoredExperience = tailorObject(experiencerows, keywords);
        const tailoredProject = tailorObject(projectrows, keywords);
        
        const newResume = {...resume, links: linkrows, educations: educationrows, experiences: tailoredExperience, projects: tailoredProject};
        generatePDF(newResume);
        return res.json({resume: newResume, keywords: keywords});

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
        const pointsArr = bullet_points.split("\n");
        const pointsMap = [];
        for(const point of pointsArr){
            const score = calcScore(point, keywords);
            pointsMap.push({point: point, score: score});
        }
        
        let objScore = 0;
        if(pointsArr.length > 3){
            pointsMap.sort((a,b)=> b.score - a.score);
            arr[i].bullet_points = pointsMap.slice(0, 3).map((item) => item.point).join("\n");
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
const generatePDF = (resume)=>{
    const {name, role, phone_number, email, summary, skills, links, educations, experiences, projects} = resume;
    const doc = new PDFDocument({margin: 54});
    doc.font("./font/calibri/calibri-font-family/calibri-regular.ttf");
     // start of a line
    const firstLineStart = 54; 

    // first line shows name + role
    doc.fontSize(10);
    doc.fontSize(14)
        .fillColor("#6495ED")
        .text(`${name} | ${role}`);
    doc.moveDown();

    // second line shows phone_number + email
    let phoneNumberWidth = doc.widthOfString(phone_number);
    doc.fontSize(9)
        .fillColor("black")
        .text(phone_number, firstLineStart, 70)
        .link(firstLineStart, 70, phoneNumberWidth - 25, 10, `tel:${phone_number}`);
    doc.fontSize(9)
        .text(' | ', firstLineStart + phoneNumberWidth - 25, 70)
        .text(email, firstLineStart + phoneNumberWidth + doc.widthOfString('|') - 15, 70)
        .link(firstLineStart + phoneNumberWidth - 15, 70, doc.widthOfString(email), 10, `mailto:${email}`);

    // third line shows all links
    // starting position for the first link
    let position = firstLineStart;

    // the first link is set before going into the loop to avoid adding a separator before the first link
    let link = links[0].link;
    let linkWidth = doc.widthOfString(link);

    doc.fontSize(9)
        .text(link, position, 85) 
        .link(position, 85, linkWidth, 10, link);

    position += linkWidth; 

    // loop over the remaining links
    for (let i = 1; i < links.length; i++) {
        link = links[i].link;
        linkWidth = doc.widthOfString(link);

        // add a separator before each link
        doc.text(' | ', position, 85);
        position += doc.widthOfString(' | ');

        // add the link
        doc.text(link, position, 85)
            .link(position, 85, linkWidth, 10, link);

        position += linkWidth; 
    }
    doc.moveDown(0.5);
    // move mouse back to the start of a line
    doc.text("", firstLineStart);
    // add rest section of the resume
    sectionPDF(doc, "Profile", summary, [11, 10]);
    sectionPDF(doc, "Skills", skills, [11, 10]);
    sectionPDFwithList(doc, "Education", educations, ["title", "subtitle"], [11, 10, 8]);
    sectionPDFwithList(doc, "Experiences", experiences, ["title", "subtitle", "bullet_points"], [11, 10, 8, 9]);
    sectionPDFwithList(doc, "Projects", projects, ["title", "subtitle", "bullet_points"], [11, 10, 8, 9]);
    doc.pipe(fs.createWriteStream('./output/myresume.pdf')); 
    doc.end();
}
function sectionPDF(doc, section, content, fonts){
    doc.fontSize(fonts[0])
        .fillColor("#6495ED")
        .text(section)
    doc.moveDown(0.25);
    doc.fontSize(fonts[1])
        .fillColor("black")
        .text(content);
    doc.moveDown(0.5);
}
// handle section with title, subtitle and bullet points
// paramters, section is section name like experience, contentArr is an array of experiences like[{title:1, subtitle: 2, bullet_points: 3}]
// looporder is ["title", "subtitle", "bullet_points"] to guanrantee iterate order
// fonts is [sectionFontSize, titleFontSize, subtitleFontSize, bullet_pointsFontSize]
function sectionPDFwithList(doc, section, contentArr,loopOrder, fonts){
    doc.fontSize(fonts[0])
        .fillColor("#6495ED")
        .text(section)
    doc.moveDown(0.25);
    for(const content of contentArr){
        for(let i = 0; i < loopOrder.length; i++){
            const property = loopOrder[i];
            if(!content[property]) break;
            if(property === "bullet_points"){
                doc.moveDown(0.25);
                content[property].split("\n").forEach((point)=>{
                    doc.fontSize(fonts[i + 1])
                        .text(point);
                })
            }else{
                doc.fontSize(fonts[i + 1])
                .fillColor("black")
                .text(content[property])
            }
            
        }
        doc.moveDown(0.5);
    }
}
module.exports = {tailorResume};