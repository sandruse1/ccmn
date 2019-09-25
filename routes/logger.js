var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/set-log', function(req, res, next) {
    fs.appendFile('logger.txt', 'hello', function (err) {
        if (err) throw err;
        console.log('Updated!');
    });
    // res.send('OK');
});

module.exports = router;
