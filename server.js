var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require("path");
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
var Login = require("./model/login.js");
var Profile = require("./model/profiledb.js");

var app = express();
var port = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(morgan("dev"));

app.use(express.static(__dirname + "/build"));

app.use(methodOverride());

//databse connection
var url = "mongodb://root:root@ds117913.mlab.com:17913/todolist";
mongoose.connect(url, function(err, db) {
  if (err) {
    console.log("Unable to connect to MongoDb server. Error: ", err);
  } else {
    console.log("Mongodb Connection established successfully at: ", url);
  }
});

//cross origin resource sharing access permission attached in Header section 

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type, Authorization, Cache-Control"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

app.post("/login", function(req, res) {
  Login.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contact: req.body.contact,
      gender: req.body.gender
    },
    function(err, login) {
      if (err)
        return res
          .status(500)
          .send("There is a problem in insertion data in Mlab");
      res.status(200).send(login);
    }
  );
});

app.post("/profile", function(req, res) {
  Profile.create(
    {
      category: req.body.category,
      email: req.body.email,
      description: req.body.description,
      priority: req.body.priority,
      date: req.body.date,
      progress: req.body.progress
    },
    function(err, profile) {
      if (err)
        return res
          .status(500)
          .send("There is a problem in insertion data in Mlab");
      res.status(200).send(profile);
    }
  );
});

app.get("/login", function(req, res) {
  Login.find({}, function(err, login) {
    if (err)
      return res
        .status(500)
        .send("There is a problem in retriving data from Mlab");
    res.status(200).send(login);
  });
});

app.put("/login/:id", function(req, res, next) {
  Login.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

app.get("/profile/:email", function(req, res) {
  Profile.find(
    {
      email: req.params.email
    },
    function(err, profile) {
      if (err)
        return res
          .status(500)
          .send("Problem in retriving data for particular user");
      if (!profile) return res.status(404).send("User does not exists");
      res.status(200).send(profile);
    }
  );
});

app.put("/profile/:id", function(req, res, next) {
  Profile.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

app.delete("/profile/:id", function(req, res, next) {
  Profile.findByIdAndRemove(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

app.get("/login/:email", function(req, res) {
  Login.findOne(
    {
      email: req.params.email
    },
    function(err, login) {
      if (err)
        return res
          .status(500)
          .send("Problem in retriving data for particular user");
      if (!login) return res.status(404).send("User does not exists");
      res.status(200).send(login);
    }
  );
});

app.get("/login/:email/:password", function(req, res) {
  Login.findOne(
    {
      email: req.params.email,
      password: req.params.password
    },
    function(err, login) {
      if (err)
        return res
          .status(500)
          .send("Problem in retriving data for particular user");
      if (!login) return res.status(404).send("User does not exists");
      res.status(200).send(login);
    }
  );
});

//send an email

app.post("/send", function(req, res) {
    console.log(req.body.password);
  const output = `
    <p>Below is the Newly Generated Password. Use this credential to login into TDL</p>
    <p>Temporary Password : <strong>${req.body.password}</strong> </p>
    <p> Don't share the password with anyone. </p>
    <p>This is an AUTO GENERATED MAIL. Please do not reply to this e-mail</p>
    `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "tdlreset@gmail.com", // generated ethereal user
      pass: "9599015901" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Reset Password" <tdlreset@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Confirmation of Password change", // Subject line
    text: "Password Reset", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    transporter.close();
  });
});

app.listen(port, function() {
  console.log("Server is running at: ", port);
});

module.exports = app;
