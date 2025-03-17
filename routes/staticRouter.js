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

staticRouter.route("/publications").get(async (req, res) => {
  const allPublications = await Publication.find({}).sort({ doc_number: -1 });

  return res.render("publications", { publications: allPublications });
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
