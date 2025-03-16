const { default: mongoose } = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    doc_number: {
      type: Number,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    journal: {
      type: String,
      required: true,
    },
    journal_link: {
      type:String,
      required:true,
    }
  },
);

const Publication = mongoose.model("publication", publicationSchema);

module.exports = { Publication };
