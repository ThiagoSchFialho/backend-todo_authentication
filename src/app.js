var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var tasksRouter = require('./routes/tasks');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');

const cors = require('cors');
require('dotenv').config();

var app = express();

app.use(cors({
    origin: process.env.FRONTEND_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/category', categoryRouter);

module.exports = app;
