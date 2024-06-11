const express = require("express");

const router = express.Router();
const {
  addFAQ,
  getAllFAQ,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

router.post("/add", addFAQ);

router.get("/list", getAllFAQ);

router.post("/update", updateFAQ);

router.post("/delete", deleteFAQ);

module.exports = router;
