var express = require('express');
var router = express.Router();
var UserModel = require('../models/User');
var encode = require('../libs/passwordHash');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser((user, done) => {
    var result = user;
    result.password = "";
    console.log('deserializer');
    done(null, result);
})

passport.use(new localStrategy({
    //form name 적기
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    UserModel.findOne({
        username: username, password: encode(password)
    }, (err, user) => {
        if (!user) {
            return done(null, false, {message: '아이디 또는 비밀번호 오류 입니다.'});
        } else {
            return done(null, user);
        }
    });
}));

router.get('/', (req, res) => {
    res.send('account app');
});

router.get('/join', (req, res) => {
    res.render('account/join');
});

router.get('/login', (req, res) => {
    res.render('account/login', {flashMessage: req.flash().error});
});

router.post('/join', (req, res) => {
    var user = new UserModel({
        username: req.body.username,
        password: encode(req.body.password),
        displayname: req.body.displayname
    });
    user.save(err => {
        res.send(`<script>
                    alert("회원가입 완료"); 
                    location.href="/account/login";
                  </script>`);
    });
});

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/account/login',
            failureFlash: true
        }),
        (req, res) => {
        res.send(`<script>
                    alert('login success'); 
                    location.href="/";
                  </script>`);
        }
        );

router.get('/success', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/account/login');
});

module.exports = router;