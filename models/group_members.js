const { default: mongoose } = require("mongoose");

const GroupMembersSchema = new mongoose.Schema({
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
  },
  education_2: {
    type: String,
  },
  education_3: {
    type: String,
  },
  profileImageURL: {
    type: String,
    required: true,
    default: "/images/GSU_Logo.jpg",
  },
});

const GroupMembers = mongoose.model("group_members", GroupMembersSchema);

module.exports = { GroupMembers };
