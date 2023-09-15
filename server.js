var express = require('express');
var cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_SECRET = "0884c92e749ddc14c19a3f61bd67f730f04a9c5c";
const CLIENT_ID = "fc03557b9245eefa893f";

var app = express();

const corsOptions = {
  origin: '*',
  methods: '*',
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
