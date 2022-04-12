const User = require("../models/User");
const Task = require("../models/Task");
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", firstname: "", secondname: "", contactno: "", image: "", description: "", date: "", completed: "" };

  if (err.message === 'incorrect email') {
    errors.email = 'Email not registered';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'Incorrect Password';
  }
  if (err.code === 11000) {
    errors.email = 'Email already registered';
    return errors;
  }
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'mylittlesecret', {
    expiresIn: maxAge
  });
};
module.exports.signup_get = (req, res) => {
  res.render('signup');
}
module.exports.login_get = (req, res) => {
  res.render('login');
}
module.exports.signup_post = async (req, res) => {

  const { email, password, firstname, secondname, image, contactno } = req.body;

  try {
    const user = await User.create({ email, password, firstname, secondname, image, contactno });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  }
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}
module.exports.profile_put = async (req, res) => {
  const { email, firstname, secondname, contactno } = req.body;
  try {
    await User.findOneAndUpdate({ email: email }, { email, firstname, secondname, contactno });

  } catch (err) {
    res.status(400).json({ errors: "Sorry! Profile Could not be updated" });
  }
}
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.task_post = async (req, res) => {
  console.log(req.body);
  const { description, date, completed } = req.body;
  try {
    await Task.findOneAndUpdate({ email: email }, { description, date, completed });

  } catch (err) {
    res.status(400).json({ errors: "Task Could not be updated" });
  }

}