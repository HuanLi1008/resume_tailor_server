const router = require("express").Router();
const tailorController = require('../controllers/tailor-controller');
const {tailorValidator} = require("../middlewares/tailor-validator");

router.route('/:userid')
    .post(tailorValidator, tailorController.tailorResume)


module.exports = router;