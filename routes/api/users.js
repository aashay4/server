const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const user = require('../../model/User');

/**
* @route POST api/users/register
* @desc Register the User
* @access public
*/

router.post('/register', (req, res) => {
  let { name, username, email, password, confirm_password } = req.body
  if(password !== confirm_password){
    return res.status(400).json({
      msg: "Password do not match"
    });
  }
User.findOne({username: username}).then(user => {
  if(user){
    return res.status(400).json({
      msg: "username taken"
    });
  }
})
User.findOne({email: email}).then(user => {
  if(user){
    return res.status(400).json({
      msg: "Email taken"
    });
  }
});
let newUser = new User({
  name,
  username,
  password,
  email
  });
  //hash Password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save().then(user => {
        return res.status(201).json({
          success: true,
          msg: "welcome"
        });
      });
    });
  });
});

/**
* @route POST api/users/login
* @desc Sigin in the User
* @access public
*/
router.post('/login', (req, res) =>{
  User.findOne({ username: req.body.username}).then(user => {
    if(!user){
      return res.status(404).json({
        msg: "username not found",
        success: false
      });
    }
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if(isMatch){
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username
        }
        jwt.sign(payload, key, {
          expiresIn: 604800
        }, (err, token) => {
          res.status(200).json({
            success: true,
            user: user,
            token: `Bearer ${token}`,
            msg: "logged in"
          });
        })
      }else {
        return res.status(404).json({
          msg: "Password wrong",
          success: false
      });
    }
  })
});
});

/**
* @route POST api/users/add
* @desc Return add form
* @access Private
*/
router.get('/add', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  return res.json({
    user: req.user
  });
})
module.exports = router;
