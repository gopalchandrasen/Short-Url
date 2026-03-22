const express = require("express");
const router = express.Router();
const {
  handleUserSignUp,
  handleGoSignUp,
  handleUserLogin,
  handleGoLogin,
} = require("../controllers/user");
router.post("/signup", handleUserSignUp);
router.get("/signup", handleGoSignUp);
router.get("/login", handleGoLogin);
router.post("/login", handleUserLogin);
module.exports = router;
