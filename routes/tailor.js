const router = require("express").Router();
const tailorController = require('../controllers/tailor-controller');
const {tailorValidator} = require("../middlewares/tailor-validator");
const {useridValidator} = require("../middlewares/resume-validator");
router.route('/:userid')
    .get([useridValidator, tailorValidator], tailorController.tailorResume)


module.exports = router;