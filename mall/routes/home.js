var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/Product');

router.get('/', (req,res) => {
    ProductsModel.find((err,products) => {
        res.render( 'home' ,
            { products : products }
        );
    });
});

module.exports = router;