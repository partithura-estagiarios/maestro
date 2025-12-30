import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: Object },
  createdAt: { type: Number },
  lastTimer: { type: Number },
  users: [],
  issues: [],
  activeIssue: { type: Object },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
