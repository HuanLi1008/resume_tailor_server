
function tailorValidator(req, res, next){
    const {jd} = req.body;
    if(!jd) return res.status(400).json({error: {message: "Please provide a job description!"}});
    next();
}

module.exports = {tailorValidator};