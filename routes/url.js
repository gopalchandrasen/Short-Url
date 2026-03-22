const express = require("express");
const router = express.Router();
const {
  handleGenerateNewShortURL,
  handleGetURL,
  handleGetAnalytics,
  handleGetShortId,
  handleViewAll,
  handleGoHome,
} = require("../controllers/url");
const { restrictToLoggedInUserOnly } = require("../middleware/auth");
router.get("/", handleGoHome);
router.post("/newUser", handleGenerateNewShortURL);
router.get("/link", handleGetShortId);
router.get("/viewAll", restrictToLoggedInUserOnly, handleViewAll);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleGetURL);

module.exports = router;
