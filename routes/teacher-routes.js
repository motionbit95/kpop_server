const express = require("express");
const {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getTeacher,
  updateTeacher,
} = require("../controllers/teacherController");
const router = express.Router();
const multer = require("multer");

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Teachers" });
// });

router.get("", getAllTeachers);

router.get("/add", function (req, res, next) {
  res.render("addTeacher", { title: "Add Teacher" });
});

router.post("/add", upload.single("profile"), addTeacher);

router.get("/update/:id", getTeacher);

router.post("/update/:id", upload.single("profile"), updateTeacher);

router.post("/delete", deleteTeacher);

module.exports = router;
