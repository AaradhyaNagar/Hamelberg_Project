const express = require("express");

const publicationsRouter = express.Router();

const { handleCreateNewPublication } = require("../controllers/publication");

publicationsRouter.route("/").post(handleCreateNewPublication);

module.exports = { publicationsRouter };
