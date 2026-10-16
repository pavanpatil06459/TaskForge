const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const todoRoutes = require('./routes/todo.routes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // cross origin resource sharing

app.get('/', (req, res) => {
  res.send('Hello World');
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("mongodb connected"))
  .catch(error => console.log("mongodb error:", error.message));


app.use("/todo", todoRoutes);
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);

module.exports = app;

/**
 * MVC : model view controller
 */