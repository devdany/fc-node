var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('mongodb connected');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/fc', {useMongoClient: true});
autoIncrement.initialize(connect);

var admin = require('./routes/admin');
var account = require('./routes/account');
var auth = require('./routes/auth');
var home = require('./routes/home');
var chat = require('./routes/chat');
var products = require('./routes/products');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');

var app = express();
var port = 3000;

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//업로드 path 추가
app.use('/uploads', express.static('statics/uploads'));
app.use('/cookies', express.static('statics/cookies'));

//session 관련 셋팅
var connectMongo = require('connect-mongo');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'dany',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});
app.use(sessionMiddleWare);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    app.locals.isLogin = req.isAuthenticated();
    app.locals.userData = req.user;
    next();
});

//routes
app.use('/admin', admin);
app.use('/account', account);
app.use('/auth', auth);
app.use('/', home);
app.use('/chat', chat);
app.use('/products', products);
app.use('/cart', cart);
app.use('/checkout', checkout);


var server = app.listen(port, () => {
    console.log('express listening on port', port);
});
var listen = require('socket.io');
var io = listen(server);

io.use((socket, next) => {
    sessionMiddleWare(socket.request, socket.request.res, next);
});

require('./libs/socketConnection')(io);