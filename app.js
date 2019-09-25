process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var axios = require('axios');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index.js');

var app = express();

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', indexRouter);
app.use('/location', indexRouter);
app.use('/analytics', indexRouter);

const config = require("./config.json");

app.post('/set-log', function(req, res, next) {
    fs.appendFile('logger.txt', req.body.text + '\n', function (err) {
        if (err) throw err;
    });
    res.status(200).send('Logger done');
});

var flint = new Flint(config);
flint.start();

flint.on("initialized", function() {
    console.log("Flint initialized successfully! [Press CTRL-C to quit]");
});
flint.hears('/hello', function(bot, trigger) {
    bot.say('%s, you said hello to me!', trigger.personDisplayName);
});
flint.hears('/help', function(bot, trigger) {
    let outputString = `**/hello:** Greetings to bot\n\n\n**/get_analytics:** Get analytics of Total Visitors, Average Dwell Time, etc.\n\n\n**/whoami:** Get your info\n\n\n**/echo:** Make the bot say the phrase\n\n\n**/get_all:** Get all logged users from UNIT\n\n\n**/get_user:** Get user by mac address`;
    bot.say("markdown", outputString);
});
flint.hears('/get_all', function(bot, trigger) {
    axios.get(`https://cisco-cmx.unit.ua/api/location/v2/clients`, {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Basic ${new Buffer('RO:just4reading').toString('base64')}`
        }
    })
    .then((response) => {
        if (response.status === 200) {
            let outputString = '';
            response.data.forEach((el, index) => {
                if (index <= 100){
                    outputString += `**Mac Address:** ${el.macAddress}\n\n`;
                }
            });
            bot.say("markdown", outputString);
        } else {
            bot.say(`Error: ${response.status}`);
        }
    })
    .catch((error) => {
        bot.say(`${error}`);
    });
});
flint.hears('/get_user', function(bot, trigger) {
    let macAddress = trigger.args.slice(1)[0];
    axios.get(`https://cisco-presence.unit.ua/api/presence/v1/clients/${macAddress}`, {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Basic ${new Buffer('RO:Passw0rd').toString('base64')}`
        }
    })
        .then((response) => {
            if (response.status === 200) {
                let outputString = '';
                if (response.data) {
                    outputString += `**Mac Address:** ${response.data.macAddress}\n\n`;
                    outputString += `**Current Site Id:** ${response.data.currentSiteId}\n\n`;
                    outputString += `**Current Site Name:** ${response.data.currentSiteName}\n\n`;
                    outputString += `**Controller:** ${response.data.controller}\n\n`;
                    outputString += `**Current ApMac Address:** ${response.data.currentApMacAddress}\n\n`;
                    outputString += `**Last ApMac Address:** ${response.data.lastApMacAddress}\n\n`;
                    outputString += `**ipv4 Address:** ${response.data.ipv4Address}\n\n`;
                    outputString += `**ipv6 Address:** ${response.data.ipv6Address}\n\n`;
                } else {
                    outputString += `**NO SUCH USER** WITH ${macAddress}\n\n`;
                }
                bot.say("markdown", outputString);
            } else {
                bot.say(`Error: ${response.status}`);
            }
        })
        .catch((error) => {
            bot.say(`${error}`);
        });
});
flint.hears('/get_analytics', function(bot, trigger) {
    axios.get(`https://cisco-presence.unit.ua/api/presence/v1/kpisummary/today?siteId=${config.siteId}`, {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': `Basic Uk86UGFzc3cwcmQ=`
        }
    })
        .then((response) => {
            if (response.status === 200) {
                let outputString =
                    `**Total Visitors:** ${response.data.visitorCount}\n\n**Average Dwell Time:** ${Math.round(response.data.averageDwell)}\n\n**Peak Hour:** ${response.data.peakSummary.peakHour}:00 - ${response.data.peakSummary.peakHour + 1}:00\n\n**Conversion Rate:** ${response.data.conversionRate}\n\n**Top Device Maker:** ${response.data.topManufacturers.name}\n\n`;
                bot.say("markdown", outputString);
            } else {
                bot.say(`Error: ${response.status}`);
            }
        })
        .catch((error) => {
            bot.say(`${error}`);
        });
});

flint.hears('/whoami', function(bot, trigger) {
    let roomId = "*" + trigger.roomId + "*";
    let roomTitle = "**" + trigger.roomTitle + "**";
    let personEmail = trigger.personEmail;
    let personDisplayName = trigger.personDisplayName;
    let outputString = `${personDisplayName} here is some of your information: \n\n\n **Room:** you are in "${roomTitle}" \n\n\n **Room id:** ${roomId} \n\n\n **Email:** your email on file is *${personEmail}*`;
    bot.say("markdown", outputString);
});
flint.hears('/echo', function(bot, trigger) {
    let phrase = trigger.args.slice(1).join(" ");
    let outputString = `Ok, I'll say it: "${phrase}"`;
    bot.say(outputString);
});

app.post('/bot', webhook(flint));

process.on('SIGINT', function() {
    flint.debug('stoppping...');
    flint.stop().then(function() {
        process.exit();
    });
});





















// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;






