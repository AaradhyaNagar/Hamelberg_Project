const { Publication } = require("../models/publication");

const handleSearchByTitle = async (title) => {
  const publicationByTitle = await Publication.find({
    // $regex : searchText; It searches for titles that contains the "searchText" string
    //$options : "i"; It enables Case-insensitive matching (e.g., "AI" matches "ai" and "Ai").
    title: { $regex: title, $options: "i" },
  }).sort({ doc_number: -1 });

  return publicationByTitle;
};

const handleLiveSuggestions = async (searchText) => {
  // If the query is empty (user hasn't typed anything), return an empty array
  if (!searchText) return res.json([]);

  try {
    // $regex : searchText; It searches for titles that contains the "searchText" string
    //$options : "i"; It enables Case-insensitive matching (e.g., "AI" matches "ai" and "Ai").
    const results = await Publication.find(
      { title: { $regex: searchText, $options: "i" } },
      // If { title : 1 } is not mentioned it will return the whole database object with the _id
      // To make the response lightweight, we omit the _id with { _id : 0 }
      { title: 1, _id: 0 }
    ).limit(5);

    return results;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return []; // Returning an empty array in case of failure
  }
};

const handleFindYears = async () => {
  const distinctYears = await Publication.distinct("year");
  distinctYears.sort((a, b) => b - a); // Sort in descending order (latest first)
  return distinctYears;
};

const handleFindAuthors = async () => {
  const distinctAuthors = await Publication.distinct("author");
  return distinctAuthors;
};

const handleFindJournals = async () => {
  const distinctJournals = await Publication.distinct("journal");
  return distinctJournals;
};

module.exports = {
  handleSearchByTitle,
  handleLiveSuggestions,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
};
