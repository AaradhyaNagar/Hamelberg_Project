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

const handleAllTitles = async () => {
  const allTitles = await Publication.find({}, { title: 1, _id: 0 });

  const allTitlesArray = Array.from(allTitles);

  return allTitlesArray;
};

const handleFindYears = async () => {
  const distinctYears = await Publication.distinct("year");
  distinctYears.sort((a, b) => b - a); // Sort in descending order (latest first)
  return distinctYears;
};

// const handleFindJournals = async () => {
//   const distinctJournals = await Publication.distinct("journal");

//   // Extract only the journal names before the first comma
//   const journalNames = [
//     ...new Set(distinctJournals.map((journal) => journal.split(",")[0].trim())),
//   ];

//   return journalNames;
// };

const handleFindJournals = async () => {
  const distinctJournals = await Publication.distinct("journal"); // Get all unique journals

  const distinctJournalsSet = new Set();

  distinctJournals.forEach((journal) => {
    const splitJournalString = journal.split(",")[0].trim();
    distinctJournalsSet.add(splitJournalString);
  });

  const distinctJournalsArray = Array.from(distinctJournalsSet).sort();

  return distinctJournalsArray;
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
  handleAllTitles,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
};
