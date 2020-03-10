const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, '../cleint/src/assets/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

const key = require('./config/keys').secret;
const user = require('./model/Note');
//initialize

const app = express();

//middleweares
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

require('./config/passport')(passport);
const db = require('./config/keys').mongoURI
mongoose.connect(db, { useURLParser: true }).then(() => {
  console.log(`db connected ${db}`)
}).catch(err => console.log(err))

app.post('/api/note/create', upload.single('img'), (req, res) => {
  console.log(req.file.path);
  const note = new Note({title: req.body.title, body: req.body.body, os: req.body.os, company: req.body.company, price: req.body.price, imgpath: req.file.originalname, purpose: req.body.purpose, size: req.body.size, twoinone: req.body.twoinone, amazonlink: req.body.amazonlink, storage: req.body.storage, ram: req.body.ram, display: req.body.display, processor: req.body.processor});
  console.log(req.file.path);
  console.log(req.file.originalname);
  note.save( (err) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({ note });
  });
});
const users = require('./routes/api/users');
app.use('/api/users', users);

const notes = require('./routes/api/notes');
app.use('/api/notes', notes);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`server started ${PORT}`);
})
