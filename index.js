const express = require('express');
const cors = require('cors');
const resume = require('./routes/resume.js');
const tailor = require('./routes/tailor.js');
const user = require('./routes/user.js');
require("dotenv").config();

const PORT= process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use('/api/resume', resume);
app.use('/api/tailor', tailor);
app.use('/api/user', user);

app.get('/', (_req, res)=>{
    return res.send("Welcom to Resume Tailor API");
})
app.get('/myresume.pdf', (_req, res)=>{
    res.type('application/pdf');
    res.sendFile('/myresume.pdf');
});

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});