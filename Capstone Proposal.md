# Resume Tailor

## Overview

Resume Tailor is an app that helps users easily tailor their resume according to the given job description. User needs to provide their mother version of resume (including all projects and experiences usually longer than one page) and their targeted job description. Resume Tailor will detect keywords and key phrase in the JD and match user's information, and automatically generate tailored resume.

### Problem

All job hunters are experiencing tailor their resume again and again. Tailoring resume is a boring and time consuming taks while job seekers are not learning anything from this repetitive process. Why don't let machine do this for us?

### User Profile

Job seekers.

### Features
1. User can type their basic info, summary, skills, education, experience, projects.
2. User can provide their targeted job description.
3. There will be a button for user to start tailoring resume.
4. After user hits start tailoring, there will be three sections, one to display detected keywords from provided job description, one to display matched bulletpoints of user's origin resume, one to display tailored resume.



## Implementation

### Tech Stack
Front-End: __React, HTML, CSS, JavaScript;__

Back-End: __Node.js, Express.js;__

Database: __mySQL;__

Test: __Jest;__



### APIs
nlpcloud: https://api.nlpcloud.io/v1/gpu/dolphin/kw-kp-extraction


### Sitemap
1. landing page guid users how to use tailor their resume with this web.
2. upload resume page so users can upload their resume.
3. my resume page where users can view their saved mother version of resume and update it.
4. tailor page whre users can input job description and hit generate tailor resume button, and display tailored resume.


### Mockups
mockup files: https://www.figma.com/file/WoHExJmZcnjqCnRYM1NI7b/Resume-Tailor?type=whiteboard&node-id=0%3A1&t=qNR97qVjxc79hBu9-1


### Data
- resume table
- schema: id, user_id, user_name, links, summary, skills, education,experience, project


### Endpoints
- post '/resume' 
    - request body:{user_id: , user_name: , links: , summary: , skills: , education: , experience: , project: ,}
    - response: {id: , user_id: , user_name: , links: , summary: , skills: , education: , experience: , project: ,}
- put '/resume/:id'
    - request body: {skills: }
    - response: {id: , user_id: , user_name: , links: , summary: , skills: __updated skills__, education: , experience: , project: ,}
- get '/tailor/:id'
    - request body:"A job description"
    - response: a tailored resume object {id: , user_id: , user_name: , links: , summary: , skills: , education: , experience: , project: ,}


### Auth
No


## Roadmap
### sprint 1
1. implement post resume and put resume for back end
2. implement landing page and link landing page with upload resume page
3. implement upload resume page where user can upload their resume and view their resume
### sprint 2
1. implement get tailored resume endpoint in backend
2. implement tailor page with two states, one for before tailor with input field of job description and a button to start tailor, one for after tailor with a section display extract keywords and key phase from job description and a section display tailored resume

## Nice-to-haves
1. download function so users can download tailored resume
2. set priority of bullet points, so when the resume doesn't have enough bullet points includes keywords from job description, resume tailor will follow the priority users set to generate resume
3. give users options to formate their resume

