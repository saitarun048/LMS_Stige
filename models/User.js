const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Enter a valid email']
  },
  firstname: {
    type: String,
    required: [true, 'Enter the first name...'],
    lowercase: true,
  },
  secondname: {
    type: String,
    required: [true, 'Enter the second name...'],
    lowercase: true,
  },
  contactno: {
    type: Number,
    required: [true, 'Enter the Contact Number...'],
    lowercase: true,
  },
  image: {
    type: String,
    required: [true, 'Upload the file...'],
  },
  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: [6, 'Password length is 6 chars'],
  }
});
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('oops! Incorrect password');
  }
  throw Error('oops! Incorrect email');
};
const User = mongoose.model('user', userSchema);
module.exports = User;