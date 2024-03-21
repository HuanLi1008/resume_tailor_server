const router = require("express").Router();
const resumeController = require('../controllers/resume-controller');
const {resumeValidator} = require('../middlewares/resume-validator');
router.route('/')    
    .post(resumeValidator,resumeController.postresume);

router.route('/:id')
    .get(resumeController.getresume);


module.exports = router;