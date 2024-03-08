const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const project = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    targetAmount: {
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
    amountRaised: {
      type: Number,
      default: 0
    },
    totalRaised:{
      type: Number,
      default: 0
    },
    recieverAddress: {
      type: String,
    },
    publicKey: {
      type: String,
    },
    privateKey: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OPEN", "BLOCK", "CLOSED"],
      default: "OPEN",
    },
    tokenAddress: {
      type: String,
      default: "0x0x0000000000000000000000000000000000000000"
    }
  },
  { timestamps: true }
);
project.plugin(mongoosePaginate);
module.exports = mongoose.model("Project", project);