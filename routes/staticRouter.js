const express = require("express");

const staticRouter = express.Router();

const { Publication } = require("../models/publication");
const { GroupMembers } = require("../models/group_members");
const { FormerMembers } = require("../models/former_members");
const { Journals } = require("../models/journals");

const {
  handleSearchResults,
  handleFindYears,
  handleFindAuthors,
  handleFindJournals,
  handleAllTitles,
} = require("../controllers/search");

const { redisClient } = require("../utils/redis");

const CACHE_EXPIRATION_TIME = 3600; // Cache for 1 hour (in seconds)

// Utility function to get data from Redis cache or fetch from source.
async function getOrCache(key, fetchDataFn) {
  try {
    // 1. Try to get data from Redis cache.
    const cachedData = await redisClient.get(key);

    // 2. If data in cache, parse and return.
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // 4. If not in cache, fetch fresh data.
    const freshData = await fetchDataFn();

    // 5. Cache fresh data in Redis.
    await redisClient.setEx(
      key,
      CACHE_EXPIRATION_TIME,
      JSON.stringify(freshData)
    );

    // 6. Return fresh data.
    return freshData;
  } catch (error) {
    // 7. Handle errors.
    console.error(`Error getting/caching ${key}:`, error);
    // 8. Fallback to fetching from DB.
    return await fetchDataFn();
  }
}

staticRouter.route("/").get(async (req, res) => {
  return res.render("home");
});

staticRouter.get("/former_members", async (req, res) => {
  const cacheKey = "all_former_members"; // Define a cache key
  const allFormerMembers = await getOrCache(
    cacheKey,
    async () => { // fetchDataFn: Fetch from the database
      return await FormerMembers.find({}).sort({ _id: 1 });
    },
    CACHE_EXPIRATION_TIME // Use your cache expiration time
  );
  return res.render("former_members", { formerMembers: allFormerMembers });
});


staticRouter.get("/group_members", async (req, res) => {
  const cacheKey = "all_group_members"; // Define a cache key
  const allGroupMembers = await getOrCache(
    cacheKey,
    async () => { // fetchDataFn: Fetch from the database
      return await GroupMembers.find({}).sort({ _id: 1 });
    },
    CACHE_EXPIRATION_TIME // Use your cache expiration time
  );
  return res.render("group_members", { groupMembers: allGroupMembers });
});


staticRouter.get("/publications", async (req, res) => {
  // Extract query params (title, year, journal, author, page, limit).
  const { title, year, journal, author, page = 1, limit = 9 } = req.query;

  // Parse page and limit to integers.
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);

  // Calculate number of docs to skip.
  const skip = (currentPage - 1) * itemsPerPage;

  // Get search/filter criteria.
  const SearchResult = handleSearchResults(title, year, journal, author);

  // Query DB for publications, sort, skip, and limit.
  const allPublications = await Publication.find(SearchResult)
    .sort({ doc_number: -1 })
    .skip(skip)
    .limit(itemsPerPage);

  // Count total matching publications for pagination.
  const totalPublications = await Publication.countDocuments(SearchResult);

  // Calculate total pages.
  const totalPages = Math.ceil(totalPublications / itemsPerPage);

  const allDistinctYears = await getOrCache(
    "distinct_years",
    handleFindYears,
    CACHE_EXPIRATION_TIME
  );
  const allDistinctAuthors = await getOrCache(
    "distinct_authors",
    handleFindAuthors,
    CACHE_EXPIRATION_TIME
  );
  const allDistinctJournals = await getOrCache(
    "distinct_journals",
    handleFindJournals,
    CACHE_EXPIRATION_TIME
  );

  res.render("publications", {
    publications: allPublications,
    distinctYears: allDistinctYears,
    distinctAuthors: allDistinctAuthors,
    distinctJournals: allDistinctJournals,
    currentPage: currentPage,
    totalPages: totalPages,
    query: req.query,
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

  //   // If the query is empty (user hasn't typed anything), return an empty array
  if (!searchText) return res.json([]);

  const allTitles = await getOrCache(
    "all_titles",
    handleAllTitles,
    CACHE_EXPIRATION_TIME
  );

  const liveSuggestions = allTitles
    .map((obj) => obj.title)
    .filter((title) => title.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, 5);

  console.log(liveSuggestions);

  return res.json(liveSuggestions);
});

staticRouter.get("/test", async (req, res) => {
  return res.json({ message: "Hello From Test" });
});

module.exports = { staticRouter };
