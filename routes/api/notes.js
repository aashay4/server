'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, './Client/src/assets/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

//models
const key = require('../../config/keys').secret;
const user = require('../../model/Note');


const app = express();

//connect server to mongoDB
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// retrieves all the notes
/**
* @route GET api/note/list
* @desc Get all notes
* @access public
*/

router.get('/list', (req, res) => {
  Note.find({}).sort({updatedAt: 'descending'}).exec((err, notes) => {
    if (err) return res.status(404).send('Error while getting notes!');
    return res.send({notes});
  });
});
// create a new note

/**
* @route GET api/note/create
* @desc Create a note
* @access private
*/



/**
* @route GET api/note/update
* @desc Update a note
* @access private
*/

router.post('/update/:id', (req, res) => {
let options = { new: true };
  Note.findByIdAndUpdate(req.params.id, req.body.data , options, (err, note) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({ message: 'note updated!', note });
  });
});

/**
* @route GET api/note/delete
* @desc Delete a note
* @access private
*/

router.post('/delete/:id', (req,res) => {
  Note.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({ message: 'note deleted!' });
  });
});

module.exports = router;
