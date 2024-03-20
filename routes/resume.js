const router = require("express").Router();
const resumeController = require('../controllers/resume-controller');
router.route('/')
    .post(resumeController.postresume)


module.exports = router;