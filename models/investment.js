const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Project = require("./project");

const investment = new mongoose.Schema(
    {
        investerAddress: {
          type: String,
        },
        investedAmount: {
            type: Number,
          },
        projectID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
        publicKeys: {
          type: String,
        },
        privateKey: {
          type: String,
        },
      },
      { timestamps: true }
);
investment.plugin(mongoosePaginate);
module.exports = mongoose.model("Investment", investment);