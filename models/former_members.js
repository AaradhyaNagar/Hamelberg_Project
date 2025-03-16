const { default: mongoose } = require("mongoose");

const FormerMembersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  education_1: {
    type: String,
    required: true,
  },
  education_2: {
    type: String,
  },
  education_3: {
    type: String,
  },
  current_position: {
    type: String,
  },
  profileImageURL: {
    type: String,
    required: true,
    default: "/images/GSU_Logo.jpg",
  },
});

const FormerMembers = mongoose.model("former_members", FormerMembersSchema);

module.exports = { FormerMembers };
