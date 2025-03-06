import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  interestedUsers: Number,
  respondedUsers: Number,
  serviceNeeds: Number,
});

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;
