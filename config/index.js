
const path = require('path');
const express = require('express');
const logger = require('morgan');

module.exports = (app) => {
    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'static-files')))
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'hbs');
}