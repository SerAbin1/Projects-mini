const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//middleware to parse the request body
app.use(express.urlencoded({ extended: true }));


//mongoDB setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//define schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: false
    },
    exercises: [
        {
            description: {
                type: String,
                required: true
            },
            duration: {
                type: Number,
                required: true
            },
            date: {
                type: String,
                default: Date.now
            }
        }
    ]  
});

//define the User model
const User = mongoose.model('User', userSchema);

//create a new user - POST /api/users
app.post('/api/users', async (req, res) => {
    const id = await createId(req.body.username);
    //check if the user already exists, if not create a new user
    if(id.username) {
        return res.json({ username: id.username, _id: id._id });
    } else {
        const user = await new User({
            username: req.body.username,
            _id: id
        }).save();
        return res.json({ username: user.username, _id: user._id });
    }
});

//get all users - GET /api/users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

//add an exercise - POST /api/users/:_id/exercises
app.post('/api/users/:_id/exercises', async (req, res) => {
    const description = req.body.description;
    const duration = req.body.duration;
    const date = req.body.date? new Date(req.body.date).toDateString() : new Date().toDateString();
    const id = req.params._id;
    //check if the user exists
    const user = await User.findById(id);
    if(!user) return res.json({ error: "User not found" });

    //Add the exercise
    user.exercises.push({
        description,
        duration,
        date,
    });
    //save the user document with the new exercise
    await user.save();
    //get the just added exercise
    const exercise = user.exercises[user.exercises.length - 1];

    return res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
    });
});

//get the exercise log - GET /api/users/:_id/logs
app.get('/api/users/:_id/logs', async (req, res) => {
    const id = req.params._id;
    const from = req.query.from? new Date(req.query.from) : null;
    const to = req.query.to? new Date(req.query.to) : null;
    const limit = req.query.limit? parseInt(req.query.limit) : null;

    try {
        const user = await User.findById(id);
        if(!user) return res.status(404).json({error: 'User not found'});
        
        let exercises = user.exercises;
        if(from) {
            exercises = exercises.filter(exercise => new Date(exercise.date) >= from);
        }
        if(to){
            exercises = exercises.filter(exercise => new Date(exercise.date) <= to);
        }
        if(limit){
            exercises = exercises.slice(0, limit);
        }

        const count = exercises.length;

        return res.json({
            _id: id,
            username: user.username,
            count: count,
            log: exercises.map(exercise => ({
                description: exercise.description,
                duration: exercise.duration,
                date: new Date(exercise.date).toDateString()
            }))
        });

    } catch (err) {
        console.error("Error while fetching logs", err);
    }
});


//helper function to create a unique id
async function createId(name) {
    try {
        const id = await User.findOne({ username: name});
        if (id) return id;
        return crypto.randomBytes(12).toString('hex');
    } catch (err) {
        console.error("Error while searching/creating userID", err);
    }
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
