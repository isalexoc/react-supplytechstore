import mongoose from "mongoose";

const dailyExchangeRateSchema = new mongoose.Schema(
  {
    dateKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    bsPerUsd: {
      type: Number,
      required: true,
      min: 0,
    },
    note: { type: String, default: "" },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const DailyExchangeRate =
  mongoose.models.DailyExchangeRate ||
  mongoose.model("DailyExchangeRate", dailyExchangeRateSchema);

export default DailyExchangeRate;
