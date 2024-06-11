const express = require("express");

const router = express.Router();
const multer = require("multer");
const {
  addFAQ,
  getAllFAQ,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

// Multer 설정
const storage = multer.memoryStorage();

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Teachers" });
// });

router.get("", function (req, res, next) {
  res.render("faq", { title: "FAQ" });
});

router.post("/add", addFAQ);

router.get("/list", getAllFAQ);

router.post("/update", updateFAQ);

router.post("/delete", deleteFAQ);

module.exports = router;
