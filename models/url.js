const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      require: true,
      unique: true,
    },
    redirectURL: {
      // unique: true,
      type: String,
      require: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
urlSchema.index({ redirectURL: 1, createdBy: 1 }, { unique: true });
const URL = mongoose.model("url", urlSchema);

module.exports = URL;
