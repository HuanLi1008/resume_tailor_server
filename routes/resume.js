const router = require("express").Router();
const resumeController = require('../controllers/resume-controller');
const {resumeValidator,} = require('../middlewares/resume-validator');
router.route('/:userid')  
    .get(resumeController.getresume)
    .post(resumeValidator,resumeController.postresume)
    .put(resumeValidator, resumeController.editresume);



module.exports = router;