const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutdb", {
  useNewUrlParser: true,
});

app.get("/workout", (req, res) => {
  db.Workout.find({})
    .sort({ userCreated: -1 })
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/all", (req, res) => {
  db.Workout.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.get("/find/:id", (req, res) => {
  db.Workout.findOne({ _id: mongojs.ObjectId(req.params.id) }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.post("/update/:id", (req, res) => {
  db.Workout.update(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    {
      $set: {
        name: req.body.name,
        type: req.body.type,
        weight: req.body.weight,
        sets: req.body.sets,
        reps: req.body.reps,
        duration: req.body.duration,
      },
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.Workout.remove(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/submit", (req, res) => {
  var workout = new db.Workout({
    name: req.body.name,
    type: req.body.type,
    weight: req.body.weight,
    sets: req.body.sets,
    reps: req.body.reps,
    duration: req.body.duration,
  });
  workout.save((err, workout) => {
    if (err) throw err;
    res.json(workout);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});