const express = require("express");

const router = express.Router();
const {
  addReview,
  getReview,
  getAllReview,
  updateReview,
  deleteReview,
  searchReview,
} = require("../controllers/reviewController");

router.post("/add", addReview);

router.post("/get", getReview);

router.get("/list", getAllReview);

router.post("/update", updateReview);

router.post("/delete", deleteReview);

router.post("/search", searchReview);

module.exports = router;
