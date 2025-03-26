const express = require("express");

const staticRouter = express.Router();

const { Publication } = require("../models/publication");
const { GroupMembers } = require("../models/group_members");
const { FormerMembers } = require("../models/former_members");
const { Journals } = require("../models/journals");

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
  const publicationByTitle = await Publication.find({
    // $regex : searchText; It searches for titles that contains the "searchText" string
    //$options : "i"; It enables Case-insensitive matching (e.g., "AI" matches "ai" and "Ai").
    title: { $regex: req.query.title, $options: "i" },
  }).sort({ doc_number: -1 });

  res.render("publications", { publications: publicationByTitle });
});

// API for Live Search Suggestions
staticRouter.get("/suggestions", async (req, res) => {
  // Extract the 'searchText' parameter from the request URL (e.g., /suggestions?searchText=example)
  const searchText = req.query.searchText;

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

     res.json(results);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

staticRouter.get("/publications", async (req, res) => {
  const allPublications = await Publication.find({}).sort({ doc_number: -1 });

  res.render("publications", { publications: allPublications });
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

module.exports = { staticRouter };
