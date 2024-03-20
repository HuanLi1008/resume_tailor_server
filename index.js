const express = require('express');
const cors = require('cors');
require("dotenv").config();

const PORT= process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());



app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});