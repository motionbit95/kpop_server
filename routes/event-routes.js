const express = require("express");

const router = express.Router();
const multer = require("multer");
const {
  addEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Teachers" });
// });

router.post("/add", addEvent);

router.get("/list", getAllEvents);

router.post("/get", getEvent);

router.post("/update", updateEvent);

router.post("/delete", deleteEvent);

module.exports = router;
