// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// return the current date
app.get("/api", function (req, res) {
  res.json({unix: Date.now(), utc: new Date().toUTCString()});
});

// return the unix timestamp of the specified date
app.get("/api/:date?", function(req, res) {
    let date = req.params.date;
    if(isUnixTimestamp(date)){
        date = Number(date);
        res.json({unix: date, utc: new Date(date).toUTCString()});
    } else if(isValidDate(date)) {
       res.json({unix: new Date(date).getTime(), utc: new Date(date).toUTCString()});
    }
    else {
        res.json({error: "Invalid Date"});
    }

    function isUnixTimestamp(str) {
        const timeStamp = Number(str);
        return !isNaN(timeStamp) && timeStamp.toString().length === 13;
    };

    function isValidDate(str) {
        const validDate = new Date(str);
        return !isNaN(validDate.getHours());
    }
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
