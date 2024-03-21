const router = require("express").Router();
const userController = require('../controllers/user-controller');

router.route('/')    
    .post(userController.postuser);



module.exports = router;