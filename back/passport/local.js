const passport = require('passport');
const {Strategy:LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');
const {User} = require('../models');
const express = require('express');
const router = express.Router();
router.post('/login', passport.authenticate('local'));

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async(email, password, done) => {
        try {
            const user = await User.findOne({
                where:{email}
            });
            if(!user) {
                return done(null, false, {reasone: '존재하지 않는 이메일입니다!'})
            }
            const result = await bcrypt.compare(password, user.password);
            if(result) {
                return done(null, user);//성공에 사용자 정보 넘겨줌
            }
            return done(null, false, {reason:'비밀번호가 틀렸습니다.'});
        } catch(error) {
            return done(error);
        } 
    }));
}