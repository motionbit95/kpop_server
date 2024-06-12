const express = require("express");

const router = express.Router();
const {
  addInquiry,
  getInquiry,
  getAllInquiry,
  updateInquiry,
  deleteInquiry,
  searchInquiry,
} = require("../controllers/inquiryController");

router.post("/add", addInquiry);

router.post("/get", getInquiry);

router.get("/list", getAllInquiry);

router.post("/update", updateInquiry);

router.post("/delete", deleteInquiry);

router.post("/search", searchInquiry);

module.exports = router;
