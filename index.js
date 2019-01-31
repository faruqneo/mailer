const express = require('express');
var exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

//Init app
const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//set static folder
app.use("/public", express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('index',{
        title: "mailer"
    });
});

app.post('/send',function(req, res){
    let output = 
    `<p>You have a new mail</p>
    <h3>Contact details</h3>
    <p>Name: ${req.body.name}</p>
    <p>Email: ${req.body.email}</p>
    <p>Message: ${req.body.message}</p>`;
     console.log(process.env.PASS)

    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });

      let mailOptions = {
        from: process.env.EMAIL, 
        to: process.env.EMAIL, 
        subject: "Hello ✔", 
        text: "Hello world?", 
        html: output 
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
});

app.listen(3000, function(){
    console.log("server is running")
});
