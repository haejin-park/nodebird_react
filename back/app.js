

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');
dotenv.config();
const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('DB 연결 성공');
    }).catch(console.error);
passportConfig();
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    app.use(hpp());
    app.use(helmet());
    // app.use(cors({
    //     origin: 'http://nodebird.com',
    //     credentials: true,
    // }));
} else {
    app.use(morgan('dev'));
}
app.use(cors({
    origin: ['http://localhost:3060', 'http://nodebird.com', 'http://13.125.122.77'],
    credentials:true
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    // cookie: {
    //     httpOnly: true, //자바스크립트로 접근하지못하게
    //     secure: false, //일단 false로 하고 https적용할 땐 ture
    //     domain: process.env.NODE_ENV = 'production' && '.nodebirdcom' //도메인 사용할 경우 
    // },
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) =>{
    res.send('hello express');
});

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(80, () => {
    console.log('서버 실행 중');
});

