var express = require('express');
var router = express.Router();
var Product = require('../models/Product');
var Comment = require('../models/Comment');
var path = require('path');

var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
var uploadDir = path.join(__dirname, '../statics/uploads');
var fs = require('fs');
var adminRequired = require('../libs/adminRequired');
var co = require('co');
var paginate = require('express-paginate');
var Checkout = require('../models/Checkout');

//multer setting
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        callback(null, 'products-' + Date.now()+'.'+file.mimetype.split('/')[1]);
    }
});

var upload = multer({storage: storage});


router.get('/', (req, res) => {
    res.send('admin app route');
});

router.get('/product',paginate.middleware(3, 50),adminRequired, async(req, res) => {
    const [results, itemCount] = await Promise.all([
        Product.find().limit(req.query.limit).skip(req.skip).exec(),
        Product.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    const pages = paginate.getArrayPages(req)(4, pageCount, req.query.page);

    res.render('admin/product', {
        products : results,
        pages: pages,
        pageCount: pageCount
    })
});

router.get('/product/write',adminRequired, csrfProtection, (req, res) => {
    res.render('admin/form', {product: "", csrfToken: req.csrfToken()});
});

router.post('/product/write', adminRequired, upload.single('thumbnail'), csrfProtection ,(req, res) => {
    var product = new Product({
        name: req.body.name,
        thumbnail: (req.file)? req.file.filename: "",
        price: req.body.price,
        description: req.body.description,
        username: req.user.username
    });

    if(!product.validateSync()) {
        product.save(err => {
            res.redirect('/admin/product');
        })
    }
});

router.get('/product/detail/:id', (req, res) => {

    var getData = async() => {
        return {
            product : await Product.findOne({'id' : req.params.id}).exec(),
            comments : await Comment.find({'product_id' : req.params.id}).exec()
        };
    };

    getData().then( result => {
        res.render('admin/productDetail', {product: result.product, comments: result.comments});
    });
});

router.get('/product/edit/:id', adminRequired, csrfProtection, (req, res) => {
    Product.findOne({
        'id': req.params.id
    }, (err, product) => {
        res.render('admin/form', {product: product, csrfToken: req.csrfToken()});
    });
});

router.post('/product/edit/:id', adminRequired, upload.single('thumbnail'), csrfProtection, (req, res) => {
    Product.findOne({
        id: req.params.id
    }, (err, product) => {
        if(req.file && product.thumbnail){
            fs.unlinkSync(uploadDir + '/' + product.thumbnail);
        }

        var query = {
            name: req.body.name,
            thumbnail: (req.file)? req.file.filename : product.thumbnail,
            price: req.body.price,
            description: req.body.description
        };
        Product.update({id: req.params.id}, {$set : query}, (err)=> {
            res.redirect('/admin/product/detail/' + req.params.id);
        });

    });
});

router.get('/product/delete/:id', (req, res) => {
    Product.remove({id:req.params.id}, (err) => {
        res.redirect('/admin/product');
    });
});

router.post('/product/comment/insert', (req, res) =>{
    var comment = new Comment({
        content: req.body.content,
        product_id: parseInt(req.body.product_id)
    });
    comment.save((err, comment) => {
        res.json({
            id: comment.id,
            content: comment.content,
            message: "success"
        });
    });
});

router.post('/product/comment/delete', (req, res) => {
    Comment.remove({id: req.body.comment_id}, err => {
        res.json({message: "success"});
    });
});

router.post('/product/ajax_summernote', adminRequired, upload.single('thumbnail'), function(req, res){
    res.send('/uploads/' + req.file.filename);
});

router.get('/order', function(req,res){
    Checkout.find( function(err, orderList){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render( 'admin/orderList' ,
            { orderList : orderList }
        );
    });
});

router.get('/order/edit/:id', function(req,res){
    Checkout.findOne( { id : req.params.id } , function(err, order){
        res.render( 'admin/orderForm' ,
            { order : order }
        );
    });
});

router.get('/statistics', adminRequired, function(req,res){
    Checkout.find( function(err, orderList){

        var barData = [];   // 넘겨줄 막대그래프 데이터 초기값 선언
        var pieData = [];   // 원차트에 넣어줄 데이터 삽입
        orderList.forEach(function(order){
            // 08-10 형식으로 날짜를 받아온다
            var date = new Date(order.created_at);
            var monthDay = (date.getMonth()+1) + '-' + date.getDate();

            // 날짜에 해당하는 키값으로 조회
            if(monthDay in barData){
                barData[monthDay]++; //있으면 더한다
            }else{
                barData[monthDay] = 1; //없으면 초기값 1넣어준다.
            }

            // 결재 상태를 검색해서 조회
            if(order.status in pieData){
                pieData[order.status]++; //있으면 더한다
            }else{
                pieData[order.status] = 1; //없으면 결재상태+1
            }

        });

        res.render('admin/statistics' , { barData : barData , pieData:pieData });
    });
});

router.post('/order/edit/:id', adminRequired, function(req,res){
    var query = {
        status : req.body.status,
        song_jang : req.body.song_jang
    };

    Checkout.update({ id : req.params.id }, { $set : query }, function(err){
        res.redirect('/admin/order');
    });
});

module.exports = router;