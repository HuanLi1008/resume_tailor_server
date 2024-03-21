const router = require("express").Router();
const resumeController = require('../controllers/resume-controller');
const {resumeValidator} = require('../middlewares/resume-validator');
router.route('/')
    .get(resumeController.getresume)
    .post(resumeValidator,resumeController.postresume)


module.exports = router;