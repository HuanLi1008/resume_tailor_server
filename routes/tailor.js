const router = require("express").Router();
const tailorController = require('../controllers/tailor-controller');

router.route('/')
    .get(tailorController.tailorresume)


module.exports = router;