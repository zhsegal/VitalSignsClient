const express = require('express')
const multer = require('multer')
const path = require('path')
const helpers = require('./helpers');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session');
const crypto = require('crypto')
const GridFsStorage = require('multer-gridfs-storage')
const stream = require('gridfs-stream')
const Grid = require('gridfs-stream');


const app = express()
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, '/public/views'))
app.set("view engine", "ejs")

app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: true,
    saveUninitialized: true
}));

const mongoURIlocal = "mongodb://localhost:27017/customersDB";
const mongoURI = "mongodb+srv://admin-zvika:5293612aA!@cluster0.ebxa4.mongodb.net/customersDB";


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const customerSchema = new mongoose.Schema({
    customer_id: String,
    video: String,
    heart_rate: Number,
    hemoglobin: Number,
    blood_pressure: Number,
    saturation: Number
})

const Customer = mongoose.model("Customer", customerSchema)


conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });


console.log((__dirname + '/public'))

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

const storage = new GridFsStorage({
    url: mongoURIlocal,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: req.sessionID,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });


app.post("/upload_video", upload.single("uploaded_video"), (req, res) => {
    var patient= new Customer({customer_id:req.sessionID })
    patient.save()
    res.render('vitalSign',{vitalSign:'heart rate', vitalSignValue: '58',vitalRout:'heart_rate'})
    console.log(req.sessionID)
    // res.redirect("/show-video");
});


app.get('/show-video', (req, res) => {
    gfs.files.findOne({ filename: req.sessionID }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'video/mp4' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        console.log(file.contentType)
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
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
            return  res.render('vitalSign',{vitalSign:'heart rate', vitalSignValue: '58',vitalRout:'heart_rate'})
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
        
    });
});



app.post('/heart_rate', (req, res) => {
    console.log(req.sessionID)
    console.log(req.body.value)
    Customer.updateOne({ customer_id: req.sessionID }, { heart_rate: req.body.value }, function (err) {
        if
            (err) { console.log(err) }
        else { console.log('success writing heart rate') }
    })

    res.render('vitalSign', { vitalSign: 'hemoglobin', vitalSignValue: '10.2', vitalRout: 'hemoglobin' })

})


app.post('/hemoglobin', (req, res) => {
    console.log(req.sessionID)
    console.log(req.body.value)
    Customer.updateOne({ customer_id: req.sessionID }, { hemoglobin: req.body.value }, function (err) {
        if
            (err) { console.log(err) }
        else { console.log('success writing heart hemoglobin') }
    })

    res.render('vitalSign', { vitalSign: 'blood pressure', vitalSignValue: '10.2', vitalRout: 'blood_pressure' })
    console.log(req.sessionID)

})

app.post('/blood_pressure', (req, res) => {
    console.log(req.sessionID)
    console.log(req.body.value)
    Customer.updateOne({ customer_id: req.sessionID }, { blood_pressure: req.body.value }, function (err) {
        if
            (err) { console.log(err) }
        else { console.log('success writing heart blood_pressure') }
    })

    res.render('vitalSign', { vitalSign: 'oxygen saturation', vitalSignValue: '120/80', vitalRout: 'saturation' })
    console.log(req.sessionID)

})

app.post('/saturation', (req, res) => {
    console.log(req.sessionID)
    console.log(req.body.value)
    Customer.updateOne({ customer_id: req.sessionID }, { saturation: req.body.value }, function (err) {
        if
            (err) { console.log(err) }
        else { console.log('success writing heart saturation') }
    })

    res.sendFile('public/index.html', { root: __dirname })
    console.log(req.sessionID)

})

app.post('/home', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
});




app.listen(port, () => console.log(`Listening on port ${port}...`));