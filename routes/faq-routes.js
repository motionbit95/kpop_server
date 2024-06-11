const express = require("express");

const router = express.Router();
const {
  addFAQ,
  getAllFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQ,
} = require("../controllers/faqController");

router.post("/add", addFAQ);

router.post("/get", getFAQ);

router.get("/list", getAllFAQ);

router.post("/update", updateFAQ);

router.post("/delete", deleteFAQ);

module.exports = router;
