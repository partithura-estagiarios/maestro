import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    number: { type: Number },
    name: { type: String },
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
