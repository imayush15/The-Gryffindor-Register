const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended: true}));

// To use the external css file we need to maintain a public folder
app.use(express.static("public_folder"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;



// The format in which the MailChimp accepts the data from the user
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

// This data will be sent to mailChimp!
  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/1c05c8457cd";
  const option = {
    method:"POST",
    auth: "imayush15:675002a8470c5fcb13a4f5551d35971f-us20"
  }

  const requestToServer = https.request(url, option, function(response) {
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    }else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  requestToServer.write(jsonData);
  requestToServer.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
})


// API key
// 675002a8470c5fcb13a4f5551d35971f-us20


// List idea
// 1c05c8457c
