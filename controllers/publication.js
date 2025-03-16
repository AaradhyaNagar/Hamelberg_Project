const { Publication } = require("../models/publication");

//Utility Functions
const getNextDocNumber = async () => {
  const MaxDocNumber = await Publication.findOne()
    .sort({ doc_number: -1 /* -1 here indicates descending order  */ })
    .exec();

  // If publications exist, return the next doc_number by incrementing the max doc_number found
  // If no publications exist, start the doc_number at 1
  return MaxDocNumber ? MaxDocNumber.doc_number + 1 : 1;
};

//Main Functions
const handleCreateNewPublication = async () => {
  const newDocNumber = await getNextDocNumber();
  console.log(newDocNumber);
};

module.exports = { handleCreateNewPublication };
