const handleUnReachableRoutes = (req, res, next) => {
  res.render("404", {
    error: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  });
};

module.exports = { handleUnReachableRoutes };
