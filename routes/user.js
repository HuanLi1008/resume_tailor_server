const router = require("express").Router();
const userController = require('../controllers/user-controller');
const {createUserValidator} = require("../middlewares/user-validator");
router.route('/')    
    .post(createUserValidator, userController.postuser);



module.exports = router;