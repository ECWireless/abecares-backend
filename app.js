var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
// const creds = require('./config');

var transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
    var name = req.body.name
    var email = req.body.email
    var message = req.body.message
    var content = `Name: ${name}\nEmail: ${email}\nMessage: ${message} `

    var mail = {
        from: name,
        to: 'Econway24@gmail.com',
        subject: 'New Message from Contact Form',
        text: content
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })

            transporter.sendMail({
                from: "Econway24@gmail.com",
                to: email,
                subject: "Submission was successful",
                text: `Thank you for contacting us!\n\nFORM DETAILS:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
            }, function(error, info){
                if(error) {
                    console.log(error);
                } else{
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
})

router.post('/application', (req, res, next) => {
    var name = req.body.name
    var content = `Name: ${name}`
    var coverLetterPath = req.body.coverLetterPath

    var mail = {
        from: name,
        to: 'Econway24@gmail.com',
        subject: `New Application: ${name}`,
        text: content,
        attachments: [
            {   // filename and content type is derived from path
                path: __dirname + coverLetterPath
            }
        ]
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: `fail: ${err}`
            })
        } else {
            res.json({
                status: 'success'
            })
            console.log('File Deleted')
            fs.unlink(__dirname + coverLetterPath, err => {
                if (err) {
                    console.log(err)
                }
            })
        }
    })
})

router.post('/upload', (req, res, next) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'no file uploaded...'})
    }

    const file = req.files.file
    file.mv(`${__dirname}/uploads/`, err => {
        if (err) {
            console.error(err)
            return res.status(500).send(err)
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}`})
    })
})

const app = express()
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use('/', router)
app.listen(process.env.PORT || 3002, 
	() => console.log("Server is running..."));