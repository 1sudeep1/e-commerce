//importing the model
const User = require('../models/user')

//importing jwt
const jwt = require('jsonwebtoken');

//importing bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//routes function for registering new users
const registerNewUser = async (req, res) => {
  try {
    const existingNumber = await User.findOne({ phone: req.body.phone });
    if (existingNumber) {
      return res.status(403).json({ msg: 'user already exist' })
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, saltRounds)
      req.body.password = hashPassword;
      await User.create(req.body)
      res.send({ msg: 'user registered successfully' })
    }
  } catch (err) {
    console.log(err)
  }
}

//routes functions for getting all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
    res.json({ msg: "all users are fetched" })

  } catch (err) {
    console.log(err)
  }
}

//function for getting details by id
const getUserPhonePassword = async (req, res) => {
  try {
    //it will carry all the detail of particular phone
    const userByPhone = await User.findOne({ phone: req.body.phone });

    //it will run if phone is not valid
    if (!userByPhone) {
      return res.json({ msg: 'Invalid phone' });
    }

    // at first encrypts our password and then Compare passwords from userByPhone and our entered password
    const isPasswordValid = await bcrypt.compare(req.body.password, userByPhone.password);

    if (isPasswordValid) {
      const token = jwt.sign({ phone: userByPhone.phone }, process?.env.SECRET_KEY);
      
      res.status(200).json({ msg: 'Login successful', token });

    } else {
      res.status(403).json({ msg: 'Password incorrect'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Server Error'});
  }
};

//function for updating details by id
const updateById = async (req, res) => {
  try {
    const userById = await User.findByIdAndUpdate(req.params.id, req.body)
    res.send(userById)
    res.json({ msg: "details with particular id are updated" })
  } catch (err) {
    console.log(err)
  }
}

const deleteById = async (req, res) => {
  try {
    const deleteData = await User.findByIdAndDelete(req.params.id)
    if (deleteData) {
      res.json({ msg: 'successfully deleted' })
    }
  } catch (err) {
    console.log(err)
  }
}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.findOne({ email: email }).then(User => {
      if (User) {
        if (User.password === password) {
          res.json({ msg: 'success' })
        } else {
          res.json({ msg: 'incorrect password' })
        }
      } else {
        res.json({ msg: 'no data found' })
      }
    })
    if (result) {
      res.json({ msg: 'data found' })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = { registerNewUser, getAllUsers, getUserPhonePassword, updateById, deleteById, userLogin }