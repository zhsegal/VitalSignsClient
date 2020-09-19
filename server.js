const express=require('express')
const multer=require('multer')
const path=require('path')
const helpers = require('./helpers');
const bodyParser=require('body-parser')

const app=express()
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))
app.set('views', path.join(__dirname, '/public/views'))
app.set("view engine", "ejs")


console.log((__dirname + '/public'))

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.post('/upload_video', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('uploaded_video');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return  res.render('vitalSign',{vitalSign:'heart rate', vitalSignValue: '58',nextVital:'hemoglobin'})
            ;
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        // res.sendFile('public/show_hr.html', {root: __dirname })
        res.render('vitalSign',{vitalSign:'heart rate', vitalSignValue: '58',nextVital:'hemoglobin'})
    });
});



app.post('/hemoglobin',(req, res) => {
    console.log(req.body)
    res.render('vitalSign',{vitalSign:'hemoglobin', vitalSignValue: '10.2',nextVital:'blood_pressure'})
    
})

app.post('/blood_pressure',(req, res) => {
    res.render('vitalSign',{vitalSign:'blood pressure', vitalSignValue: '120/80', nextVital:'saturation'})
})

app.post('/saturation',(req, res) => {
    res.render('vitalSign',{vitalSign:'oxygen saturation',  vitalSignValue: '100',nextVital:'home'})
})

app.post('/home',(req, res) => {
    res.sendFile('public/index.html', {root: __dirname })
});




app.listen(port, () => console.log(`Listening on port ${port}...`));