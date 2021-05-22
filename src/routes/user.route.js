var express = require('express'),
    router = express.Router();

// controllers
const userController = require( "../controllers/user.controller" );



router.get('/generateUsername', userController.generateUsername);


module.exports = router;