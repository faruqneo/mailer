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


            // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS // generated ethereal password
            },
            tls:{
                rejectUnathorized: false
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer contact" <faruq.cvrp@gmail.com>', // sender address
            to: "faruq.cvrp@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
            return false;
            }

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('index',{
            msg: "Email has been sent"
        });

        });
});

app.listen(3000, function(){
    console.log("server is running")
});
