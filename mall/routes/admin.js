var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('admin app route');
});

router.get('/product', (req, res) => {
    res.send('admin products');
})

module.exports = router;