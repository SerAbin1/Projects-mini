require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const util = require('util');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

//mongodb schema
const table = new mongoose.Schema({
    short: {
        type: Number,
        required: true
    },
    long: {
        type: String
    }
});

const db = mongoose.model("db", table);


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  const valid = await isValidURL(req.body.url);
  if(!valid) {
    return res.json({error: "invalid url"});
  }
  const id = await createShortURL(req.body.url);
console.log(id);
  let entry = new db({
        short: id,
        long: req.body.url
    });
  saveData(entry);

  res.json({ original_url: req.body.url, short_url: id });

  async function createShortURL(long) {
    try {
        let res = await db.findOne({long: long});
        
        if(res != null) {
            let shortURL = res.short;
            return shortURL;
        } else {
            let shortID = Math.floor(Math.random()*long.length) % 100;
            return shortID;
        }
    }
    catch(err) {
        console.error("Db error", err);
    }
 }

  async function saveData(entry) {
    try {
        const savedDoc = await entry.save();
      } catch (err) {
            console.error("Error saving document:", err);
        }
    }

  async function isValidURL(url) {
    const lookup = util.promisify(dns.lookup);
    try {
        const validurl = new URL(url);
        await lookup(validurl.hostname);
        return true;
    } catch (err) {
        return false;
    }
  }
});

app.get("/api/shorturl/:short_url", async function(req, res) {
    let url = req.params.short_url;
    let redirecturl = await db.findOne({short: url});

    res.redirect(redirecturl.long);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
