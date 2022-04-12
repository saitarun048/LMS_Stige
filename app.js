const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const dbURI =
    "mongodb+srv://tarun:tarun123@cluster0.1vfyk.mongodb.net/Cluster0?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/profile", requireAuth, (req, res) => res.render("profile"));
app.get("/task", requireAuth, (req, res) => res.render("task"));
app.get("/course", requireAuth, (req, res) => res.render("course"));
app.use(authRoutes);