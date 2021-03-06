const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const hpp = require('hpp');
const helmet = require('helmet');
const passprotConfig = require('./passport');
const db = require('./models');
// const bodyParser = require('body-parser');

const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const searchAPIRouter = require('./routes/search');

const prod = process.env.NODE_ENV === 'production';

dotenv.config();
const app = express();
db.sequelize.sync();
passprotConfig();

// if (prod) {
//     app.use(hpp());
//     app.use(helmet());
//     app.use(morgan('combined'));
//     app.use(cors({
//         origin: 'http://easyho93.com',
//         credentials: true,
//     }))

// } else {
//     app.use(morgan('dev'));
//     app.use(cors({
//         origin: true,
//         credentials: true,
//     }))
// }


app.use(morgan('dev'));
app.use('/', express.static('uploads'))
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        // domain: prod && '.easyho93.com',
    },
    name: 'ljerk',
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('easyho93 백엔드 정상 동작');
});

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/search', searchAPIRouter);

// app.listen(prod ? process.env.PORT : 3065, () => {
//     console.log('server is running on 3065');
// })

app.listen(3065, () => {
    console.log('server is running on 3065');
})