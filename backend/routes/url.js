const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  handleGenerateNewShortURL,
  handleGetURL,
  handleGetAnalytics,
  handleGetShortId,
  handleViewAll
} = require("../controllers/url");

// const { restrictToLoggedInUserOnly } = require("../middleware/auth");
router.post("/newUser", protect, handleGenerateNewShortURL);
router.get("/link", protect, handleGetShortId);
// router.get("/viewAll", restrictToLoggedInUserOnly, handleViewAll);
router.get("/viewAll", protect, handleViewAll);
router.get("/analytics/:shortId", protect, handleGetAnalytics);
router.get("/:shortId", handleGetURL);

module.exports = router;
