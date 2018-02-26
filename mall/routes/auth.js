var express = require('express');
var router = express.Router();
var userModel = require('../models/User');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new facebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: "252746428582593", //입력하세요
        clientSecret: "f71c3f92d6cae7d556fdc9e323e58699", //입력하세요.
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    function (accessToken, refreshToken, profile, done) {
        userModel.findOne(
            {username: "fb_" + profile.id}, (err, user) => {
                if (!user) {
                    var regData = {
                        username: "fb_" + profile.id,
                        password: "facebook_login",
                        displayname: profile.displayName
                    };
                    var User = new userModel(regData);
                    User.save(err => {
                        done(null, regData);//세션등록
                    });
                } else {
                    done(null, user);
                }
            }
        )
    }
));

router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail'
        }));


router.get('/facebook/success', (req, res) => {
    res.send(req.user);
});

router.get('/facebook/fail', (req, res) => {
    res.send('facebook login fail');
});

module.exports = router;