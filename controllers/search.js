const { Publication } = require("../models/publication");

const handleSearchResults = (title, year, journal, author) => {
  let filter = {};

  if (title) {
    const escapedTitle = title.replace(/([(){}\[\]\\.+\-*?^$|])/g, "\\$1");
    filter.title = { $regex: escapedTitle, $options: "i" };
  }

  // Apply filters only if the values are not "All" and exist
  if (year && year !== "All") {
    filter.year = year;
  }
  // Apply filters only if the values are not "All" and exist
  if (journal && journal !== "All") {
    // Escape parentheses and special regex characters in the journal string
    const escapedJournal = journal.replace(/([(){}\[\]\\.+\-*?^$|])/g, "\\$1");

    filter.journal = { $regex: escapedJournal };
  }
  // Apply filters only if the values are not "All" and exist
  if (author && author !== "All") {
    filter.author = { $regex: author };
  }

  return filter;
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

const handleFindJournals = async () => {
  const distinctJournals = await Publication.distinct("journal");

  // Extract only the journal names before the first comma
  const journalNames = [
    ...new Set(distinctJournals.map((journal) => journal.split(",")[0].trim())),
  ];

  return journalNames;
};

const handleFindAuthors = async () => {
  const allAuthors = await Publication.distinct("author"); // Get all unique author strings

  const distinctAuthorsSet = new Set(); // Create a Set to store unique author names

  allAuthors.forEach((author) => {
    const splitAuthorString = author.split(",").map((author) => author.trim()); // Split by comma, trim whitespace

    splitAuthorString.forEach((author) => {
      distinctAuthorsSet.add(author); // Add each author to the Set (only unique values stored)
    });
  });

  const distinctAuthorsArray = Array.from(distinctAuthorsSet).sort(); // Convert Set to sorted array

  return distinctAuthorsArray; // Return the array of unique authors
};

module.exports = {
  handleSearchResults,
  handleLiveSuggestions,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
};
