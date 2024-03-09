const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Project = require("./project");
mongoose.pluralize(null);
const investment = new mongoose.Schema(
    {
        investorAddress: {
          type: String,
        },
        investedAmount: {
            type: Number,
        },
        actualAmount: {
          type: Number,
      },
        projectID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        }
      },
      { timestamps: true }
);
investment.plugin(mongoosePaginate);
module.exports = mongoose.model("Investment", investment);