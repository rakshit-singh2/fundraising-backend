const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const project = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    totalAmount: {
      type: Number,
    },
    tokenSupply: {
      type: Number,
    },
    minimumBuy: {
      type: Number,
    },
    maximumBuy: {
      type: Number,
    },
    vesting: {
      type: Number,
    },
    recieverAddress: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OPEN", "BLOCK", "CLOSED"],
      default: "OPEN",
    }
  },
  { timestamps: true }
);
project.plugin(mongoosePaginate);
module.exports = mongoose.model("Project", project);