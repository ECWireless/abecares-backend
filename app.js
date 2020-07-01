let express = require('express');
let fileUpload = require('express-fileupload');
let fs = require('fs');
let router = express.Router();
let nodemailer = require('nodemailer');
let cors = require('cors');
// const creds = require('./config');

let transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
    let name = req.body.name
    let email = req.body.email
    let message = req.body.message
    let content = `Name: ${name}\nEmail: ${email}\nMessage: ${message} `

    let mail = {
        from: name,
        to: 'Econway24@gmail.com',
        subject: 'New Submission from Contact Form',
        text: content,
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
    let name = req.body.name
    let address1 = req.body.address1
    let address2 = req.body.address2
    let city = req.body.city
    let americanState = req.body.americanState
    let zipCode = req.body.zipCode
    let phone = req.body.phone
    let email = req.body.email
    let birthMonth = req.body.birthMonth
    let birthDay = req.body.birthDay
    let birthYear = req.body.birthYear
    let isCitizen = req.body.isCitizen
    let employmentDesired = req.body.employmentDesired
    let startDate = req.body.startDate
    let salary = req.body.salary
    let highSchool = req.body.highSchool
    let highSchoolGraduated = req.body.highSchoolGraduated
    let college = req.body.college
    let collegeDegree = req.body.collegeDegree
    let collegeGraduated = req.body.collegeGraduated
    let graduateSchool = req.body.graduateSchool
    let graduateDegree = req.body.graduateDegree
    let graduateSchoolGraduated = req.body.graduateSchoolGraduated
    let qualifications = req.body.qualifications
    let currentEmployer = req.body.currentEmployer
    let currentPosition = req.body.currentPosition
    let currentSalary = req.body.currentSalary
    let currentReasonLeaving = req.body.currentReasonLeaving
    let currentEmploymentStartDate = req.body.currentEmploymentStartDate
    let currentEmploymentContact = req.body.currentEmploymentContact
    let previousEmployer1 = req.body.previousEmployer1
    let previousPosition1 = req.body.previousPosition1
    let previousSalary1 = req.body.previousSalary1
    let previousReasonLeaving1 = req.body.previousReasonLeaving1
    let previousEmploymentStartDate1 = req.body.previousEmploymentStartDate1
    let previousEmploymentEndDate1 = req.body.previousEmploymentEndDate1
    let previousEmploymentContact1 = req.body.previousEmploymentContact1
    let previousEmployer2 = req.body.previousEmployer2
    let previousPosition2 = req.body.previousPosition2
    let previousSalary2 = req.body.previousSalary2
    let previousReasonLeaving2 = req.body.previousReasonLeaving2
    let previousEmploymentStartDate2 = req.body.previousEmploymentStartDate2
    let previousEmploymentEndDate2 = req.body.previousEmploymentEndDate2
    let previousEmploymentContact2 = req.body.previousEmploymentContact2

    let coverLetterFileName = req.body.coverLetterFileName
    let coverLetterURL = req.body.coverLetterURL
    let resumeFileName = req.body.resumeFileName
    let resumeURL = req.body.resumeURL

    // CONTENT
    let content = `
        PERSONAL INFORMATION
        Name: ${name}
        Address: 
            ${address1}
            ${address2}
            ${city}, ${americanState} ${zipCode}

        Phone Number: ${phone}
        Email Address: ${email}
        Birthday: ${birthMonth} ${birthDay}, ${birthYear}
        Are you a US citizen? ${isCitizen ? 'Yes' : 'No'}

        EMPLOYMENT DESIRED
        Position Applying for: ${employmentDesired}
        Date You Can Start: ${startDate}
        Desired Salary: ${salary}

        EDUCATION
        High School: ${highSchool}
        Did you graduate? ${highSchoolGraduated ? 'Yes' : 'No'}
        College: ${college}
        Area of Study/Degree: ${collegeDegree}
        Did you graduate? ${collegeGraduated ? 'Yes' : 'No'}
        Graduate School: ${graduateSchool}
        Area of Study/Degree: ${graduateDegree}
        Did you graduate? ${graduateSchoolGraduated ? 'Yes' : 'No'}

        SKILLS/QUALIFICATIONS
        Which relevant certifications or qualifications do you have?
        ${qualifications}

        CURRENT EMPLOYMENT
        Current Employer: ${currentEmployer}
        Position: ${currentPosition}
        Salary: ${currentSalary}
        Reason for Leaving: ${currentReasonLeaving}

        Start Date: ${currentEmploymentStartDate}
        May we contact? ${currentEmploymentContact}

        PREVIOUS EMPLOYMENT
        Previous Employer: ${previousEmployer1}
        Position: ${previousPosition1}
        Salary: ${previousSalary1}
        Reason for Leaving: ${previousReasonLeaving1}

        Start Date: ${previousEmploymentStartDate1}
        End Date: ${previousEmploymentEndDate1}
        May we contact? ${previousEmploymentContact1}

        -----

        Previous Employer: ${previousEmployer2}
        Position: ${previousPosition2}
        Salary: ${previousSalary2}
        Reason for Leaving: ${previousReasonLeaving2}

        Start Date: ${previousEmploymentStartDate2}
        End Date: ${previousEmploymentEndDate2}
        May we contact? ${previousEmploymentContact2}
    `

    let mail = {
        from: name,
        to: 'Econway24@gmail.com',
        subject: `New Application: ${name}`,
        text: content,
        attachments: [
            {   // use URL as an attachment
                filename: coverLetterFileName,
                path: coverLetterURL
            },
            {   // use URL as an attachment
                filename: resumeFileName,
                path: resumeURL
            }
        ]
    }

    if (coverLetterURL === '' && resumeURL === '') {
        mail = {
            from: name,
            to: 'Econway24@gmail.com',
            subject: `New Application: ${name}`,
            text: content
        }
    } else if (coverLetterURL !== '' && resumeURL === '') {
        mail = {
            from: name,
            to: 'Econway24@gmail.com',
            subject: `New Application: ${name}`,
            text: content,
            attachments: [
                {   // use URL as an attachment
                    filename: coverLetterFileName,
                    path: coverLetterURL
                }
            ]
        }
    } else if (coverLetterURL === '' && resumeURL !== '') {
        mail = {
            from: name,
            to: 'Econway24@gmail.com',
            subject: `New Application: ${name}`,
            text: content,
            attachments: [
                {   // use URL as an attachment
                    filename: resumeFileName,
                    path: resumeURL
                }
            ]
        }
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
            console.log('Mail sent!')
        }
    })
})

const app = express()
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use('/', router)
app.listen(process.env.PORT || 3002, 
	() => console.log("Server is running..."));