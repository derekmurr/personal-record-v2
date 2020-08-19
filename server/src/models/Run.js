import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
  userProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  blocked: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  media: {
    type: String
  },
  distance: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  workoutType: {
    type: String,
    enum: ['DefaultRun', 'Easy', 'Recovery', 'Hills', 'Tempo', 'Intervals', 'Long', 'Race'],
    required: true
  },
  notes: String,
  tempInC: Number,
  weather: {
    type: [String],
    enum: ['SUNNY', 'HUMID', 'WIND', 'SNOW', 'RAIN']
  },
  treadmill: {
    type: Boolean,
    default: false,
  },
  effort: Number,
  rating: Number,
  completed: {
    type: Boolean,
    default: true,
  },
  racePosition: Number,
  raceFieldSize: Number,
  raceAgeGroupPosition: Number,
  raceAgeGroupFieldSize: Number,
});

// Add a text index to the schema for the 'title' field on runs, to 
// support full-text search on Runs with a searchRuns query
runSchema.index({ title: "text" });

const Run = mongoose.model("Run", runSchema);

export default Run;
