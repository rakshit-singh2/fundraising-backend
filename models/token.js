const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Project = require("./project");

const token = new mongoose.Schema(
  {
    tokenAddress: {
      type: String,
    },
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

token.plugin(mongoosePaginate);
module.exports = mongoose.model("Token", token);
