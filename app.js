const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
})

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);      // JSON.stringify convert JavaScript object to {'key': 'value'}

    const url = "https://us12.api.mailchimp.com/3.0/lists/249dd4c7c7";

    const options = {
        method: "POST",
        auth: "ing1:ef7c499bc456016340cd52e1e24ea126-us12"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname+ "/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})
// APIKEY
// ef7c499bc456016340cd52e1e24ea126-us12
// List id
// 249dd4c7c7