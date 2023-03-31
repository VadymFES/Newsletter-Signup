const express = require ("express");
const request = require("request");
const bodyParser = require ("body-parser");
const https = require ("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.sName;
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

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/b90589789f";

    const options = {
        method: "post",
        auth: "YOUR_LIST_ID:YOUR_LIST_ID"
    };

    const request = https.request(url, options, function(response){
        if (response.statusCode===200){
            res.sendFile(__dirname + "/success.html");

            response.on("data", function(data){
                console.log(JSON.parse(data));
            });
        }
        else{
            res.sendFile(__dirname + "/failure.html");

            response.on("data", function(data){
                console.log(JSON.parse(data));
            });
        }
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Server is running on port ${port}.`);
});



// f38bbdfedefffbffa82a698f286d97fd-us12

// b90589789f
