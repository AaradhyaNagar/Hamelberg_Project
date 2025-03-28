const express = require("express");

const staticRouter = express.Router();

const { Publication } = require("../models/publication");
const { GroupMembers } = require("../models/group_members");
const { FormerMembers } = require("../models/former_members");
const { Journals } = require("../models/journals");

const {
  handleSearchByTitle,
  handleFilterResults,
  handleLiveSuggestions,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
} = require("../controllers/search");

staticRouter.route("/").get(async (req, res) => {
  const allPublications = await Publication.find({}).sort({ doc_number: -1 });

  return res.render("home", { publications: allPublications });
});

staticRouter.route("/former_members").get(async (req, res) => {
  const allFormerMembers = await FormerMembers.find({}).sort({ _id: 1 });
  return res.render("former_members", { formerMembers: allFormerMembers });
});

staticRouter.route("/group_members").get(async (req, res) => {
  const allGroupMembers = await GroupMembers.find({}).sort({ _id: 1 });
  return res.render("group_members", { groupMembers: allGroupMembers });
});

staticRouter.get("/publications/search-by-title", async (req, res) => {
  const title = req.query.title;

  const publicationByTitle = await handleSearchByTitle(title);
  return res.render("publications", { publications: publicationByTitle });
});

staticRouter.get("/publications", async (req, res) => {
  const { year, journal, author } = req.query;

  const filterResult = handleFilterResults(year, journal, author);

  const allPublications = await Publication.find(filterResult).sort({
    doc_number: -1,
  });
  const allDistinctYears = await handleFindYears();
  const allDistinctAuthors = await handleFindAuthors();
  const allDistinctJournals = await handleFindJournals();

  return res.render("publications", {
    publications: allPublications,
    distinctYears: allDistinctYears,
    distinctAuthors: allDistinctAuthors,
    distinctJournals: allDistinctJournals,
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
  try {
    // Extract the 'searchText' parameter from the request URL (e.g., /suggestions?searchText=example)
    const searchText = req.query.searchText;
    const liveSuggestions = await handleLiveSuggestions(searchText);

    return res.json(liveSuggestions);
  } catch (error) {
    console.error("Server error in /suggestions route:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

staticRouter.get("/test", async (req, res) => {
  return res.json({ message: "Hello From Test" });
});

module.exports = { staticRouter };
