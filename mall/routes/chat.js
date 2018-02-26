var express = require('express');
var router = express.Router();

var loginRequired = require('../libs/loginRequired');

router.get('/', loginRequired, (req,res) => {
    res.render('chat/index');
});

module.exports = router;