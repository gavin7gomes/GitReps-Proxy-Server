var express = require('express');
var cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_SECRET = "7f9f5ab59e2ba1590af0e207226bb3f5585546a8";
const CLIENT_ID = "b1b55489f40c124966a1";

var app = express();

const corsOptions = {
  origin: 'https://https://gitreps.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" +  req.query.code;

    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then(async (data) => {
        console.log(data);
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${data.access_token}`
            }
        }).then((response) => {
            return response.json();
        }).then((data2) => {
            res.json({...data, ...data2});
        })
    })
})


app.get("/getUserData", async function (req, res) {
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": req.get("Authorization")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            res.json(data);
        })
})

app.get("/", function (req, res) {
    res.write('Lets proxyy');
    res.end();
})

app.listen(4000, function(){
    console.log("CORS server running on port 4000");
})
