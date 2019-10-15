import express from'express'
import cookieParser from 'cookie-parser';
import graphqlHTTP from 'express-graphql';
import schema from './graphql/schema'
import request from 'graphql-request'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import session from 'express-session'

var FileStore = require('session-file-store')(session);

const dbName = 'userinfoTable';
const MONGODB_URL = `mongodb+srv://admin:wkdqkdrn8172!@cluster0-9oxri.mongodb.net/${dbName}?retryWrites=true&w=majority`

const app = express();
const path = require('path');

app.use(cookieParser());
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:true,
    store: new FileStore()
}));
app.use(bodyParser());

mongoose.Promise = global.Promise;// db 연결 (비동기 처리)
mongoose.connect(MONGODB_URL, {useNewUrlParser: true, //useNewUrlParser, useUnifiedTopology 찾아보기
    useUnifiedTopology: true })


app.use('/', express.static(path.resolve(__dirname, '../')));

app.get('/logincheck', (req,res,next)=>{
    if(req.session.logined)
        res.redirect('/login/loginSuccess.html');
    else
        res.redirect('/');
})

// app.get('/testcookie', (req,res,next)=>{
//     res.send(req.cookies);
//     //console.log(`Cookies: ${req.cookies}`);
// })

// app.get('/setCookie', (req, res, next)=>{
//     res.cookie("string", 'testcookie');
//     res.cookie('json',{
//         name:'shjang',
//         property:'Korean'
//     });
//     res.redirect('/testcookie');
// });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

const handleLoginRequest = (URI, query) =>{
    // return new Promise((resolve, reject) =>{
    //     request(URI, query).then((data))
    // })
    let resData = request(URI, query).then( (data) => { return data });
    return resData;
}



app.post('/hello', (req, res, next)=>{
    const loginID = req.param(`login-id`);
    const loginPwd = req.param(`login-pwd`);

    console.log(loginID, loginPwd);
    let query = `{
        getByIdUser(_userID:"${loginID}"){
            _userID
            _userPwd
        }
    }`;
    
    const resData = handleLoginRequest("http://localhost:3000/graphql",query);
    resData.then((result) => {
        if(result.getByIdUser._userID === loginID && result.getByIdUser._userPwd === loginPwd){
            req.session.logined = true;
            req.session.userID = loginID;
            res.redirect('./login/loginSuccess.html');
        }
        else{
            res.redirect('/');
        }
    })
    //console.log(resData);
});

app.post('/memberjoin', (req, res, next) => {
    const m_id = req.param(`m-id`);
    const m_pwd = req.param('m-pwd');
    const m_name = req.param('m-name');
    const m_age = req.param('m-age');
    const m_gender = req.param('m-gender');
    //console.log(m_id, m_pwd, m_name, m_age, m_gender);
    const query = `mutation{
        addUser(input:{
            _userID: "${m_id}"
            _userPwd: "${m_pwd}"
            name: "${m_name}"
            age: ${m_age}
            gender: "${m_gender}"
          }){
            _userID
            _userPwd
            name
            age
            gender
          }
    }`
    request("http://localhost:3000/graphql", query).then( (data) => console.log(data));
    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log("Server Running at http://localhost:3000");
})