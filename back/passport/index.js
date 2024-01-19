const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user,done) => {
        done(null,user.id);//첫번째 인자 에러, 두번째 인자 성공(쿠키와 묶어줄 user아이디만 저장)
    });
    passport.deserializeUser(async(id, done) => {
        try {
           const user = await User.findOne({where:{id}})
           done(null,user);
        } catch(error) {
            console.error(error);
            done(error);
        }
    });
    local();
};