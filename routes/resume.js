const router = require("express").Router();
const resumeController = require('../controllers/resume-controller');
const {resumeValidator, useridValidator} = require('../middlewares/resume-validator');
router.route('/:userid')  
    .get(useridValidator, resumeController.getresume)
    .post(resumeValidator,resumeController.postresume);



module.exports = router;