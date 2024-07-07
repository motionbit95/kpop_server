const express = require("express");
const {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getTeacher,
  updateTeacher,
  searchByKeyword,
} = require("../controllers/teacherController");
const router = express.Router();
const multer = require("multer");

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/add", upload.single("profile"), addTeacher);

router.get("/list", getAllTeachers);

router.post("/get", getTeacher);

router.post("/update", upload.single("profile"), updateTeacher);

router.post("/delete", deleteTeacher);

router.post("/search", searchByKeyword);

module.exports = router;
