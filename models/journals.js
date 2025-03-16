const { default: mongoose } = require("mongoose");

const journalsSchema = new mongoose.Schema({
  journal_number: {
    type: Number,
    required: true,
    unique: true,
  },
  journal_name: {
    type: String,
    required: true,
  },
  journal_link: {
    type: String,
    required: true,
  },
});

const Journals = mongoose.model("journals", journalsSchema);

module.exports = { Journals };
