const express = require("express");

const staticRouter = express.Router();

const { Publication } = require("../models/publication");
const { GroupMembers } = require("../models/group_members");
const { FormerMembers } = require("../models/former_members");
const { Journals } = require("../models/journals");

const {
  handleSearchResults,
  handleLiveSuggestions,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
} = require("../controllers/search");

staticRouter.route("/").get(async (req, res) => {
  return res.render("home");
});

staticRouter.route("/former_members").get(async (req, res) => {
  const allFormerMembers = await FormerMembers.find({}).sort({ _id: 1 });
  return res.render("former_members", { formerMembers: allFormerMembers });
});

staticRouter.route("/group_members").get(async (req, res) => {
  const allGroupMembers = await GroupMembers.find({}).sort({ _id: 1 });
  return res.render("group_members", { groupMembers: allGroupMembers });
});

// In your staticRouter.js

// In your staticRouter.js

staticRouter.get("/publications", async (req, res) => {
  // Extract query parameters for search, filter, and pagination
  const { title, year, journal, author, page = 1, limit = 9 } = req.query;
  // 'page' defaults to 1 if not provided in the query
  // 'limit' defaults to 9 if not provided, determining how many publications per page

  // Convert page and limit to integers
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);

  // Calculate the number of documents to skip to get the correct page
  // For page 1, skip = (1 - 1) * 9 = 0
  // For page 2, skip = (2 - 1) * 9 = 9
  // For page 3, skip = (3 - 1) * 9 = 18, and so on.
  const skip = (currentPage - 1) * itemsPerPage;

  // Call the function to handle search and filter criteria based on the query parameters
  const SearchResult = handleSearchResults(title, year, journal, author);

  // Query the database for publications matching the search/filter criteria
  // .sort({ doc_number: -1 }) orders the results (e.g., by document number in descending order)
  // .skip(skip) skips the calculated number of documents
  // .limit(itemsPerPage) retrieves only the specified number of documents for the current page
  const allPublications = await Publication.find(SearchResult)
    .sort({ doc_number: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  // Count the total number of publications that match the search/filter criteria
  // This is needed to calculate the total number of pages for pagination
  const totalPublications = await Publication.countDocuments(SearchResult);

  // Calculate the total number of pages
  // Math.ceil rounds up to the nearest integer, ensuring we have enough pages to display all results
  const totalPages = Math.ceil(totalPublications / itemsPerPage);

  // Fetch distinct values for the filter dropdowns (these are the same regardless of the page)
  const allDistinctYears = await handleFindYears();
  const allDistinctAuthors = await handleFindAuthors();
  const allDistinctJournals = await handleFindJournals();

  // Render the 'publications' view (publications.ejs) and pass the data to it
  res.render("publications", {
    publications: allPublications, // The publications for the current page
    distinctYears: allDistinctYears,
    distinctAuthors: allDistinctAuthors,
    distinctJournals: allDistinctJournals,
    currentPage: currentPage, // The current page number
    totalPages: totalPages, // The total number of pages
    query: req.query, // The original query parameters, useful for preserving search/filter when navigating pages
  });
});

staticRouter.route("/links").get(async (req, res) => {
  const allJournals = await Journals.find({}).sort({ journal_number: -1 });

  return res.render("links", { journals: allJournals });
});

staticRouter.route("/contact_us").get((req, res) => {
  return res.render("contact_us");
});

staticRouter.route("/research").get((req, res) => {
  return res.render("research");
});

staticRouter.route("/gallery").get((req, res) => {
  return res.render("gallery");
});

// API for Live Search Suggestions
staticRouter.get("/suggestions", async (req, res) => {
  // Extract the 'searchText' parameter from the request URL (e.g., /suggestions?searchText=example)
  const searchText = req.query.searchText;
  const liveSuggestions = await handleLiveSuggestions(searchText);

  return res.json(liveSuggestions);
});

staticRouter.get("/test", async (req, res) => {
  return res.json({ message: "Hello From Test" });
});

module.exports = { staticRouter };
