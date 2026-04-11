const express = require("express");
const router = express.Router();


const {
  handleUserSignUp,
  handleGoSignUp,
  handleUserLogin,
  handleGoLogin,
} = require("../controllers/user");
router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);
router.get("/signup", handleGoSignUp);
router.get("/login", handleGoLogin);
module.exports = router;
