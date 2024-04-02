import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
