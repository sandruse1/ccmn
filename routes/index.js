var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { remoteAddress: req.connection.remoteAddress });
});

router.get('/users', function(req, res, next) {
    res.render('index', { remoteAddress: req.connection.remoteAddress });
});

router.get('/location', function(req, res, next) {
    res.render('index', { remoteAddress: req.connection.remoteAddress });
});

router.get('/analytics', function(req, res, next) {
    res.render('index', { remoteAddress: req.connection.remoteAddress });
});

module.exports = router;
