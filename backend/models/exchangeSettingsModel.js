import mongoose from "mongoose";

const exchangeSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "global", index: true },
    /**
     * Puntos % sumados a la brecha mercado (USDT/BCV). null = usar predeterminado del código (3).
     */
    extraPercentagePoints: { type: Number, default: null },
  },
  { timestamps: true }
);

const ExchangeSettings =
  mongoose.models.ExchangeSettings ||
  mongoose.model("ExchangeSettings", exchangeSettingsSchema);

export default ExchangeSettings;
