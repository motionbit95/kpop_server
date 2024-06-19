const express = require("express");
const {
  addAuth,
  deleteAuth,
  sendEmail,
  checkVerify,
} = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 계정관련
router.post("/addAuth", addAuth);

router.get("/deleteAuth/:id", deleteAuth);

router.post("/sendEmail", sendEmail);

router.post("/checkVerify", checkVerify);

// router.post("/add", upload.single("profile"), addTeacher);

// router.get("/list", getAllTeachers);

// router.post("/get", getTeacher);

// router.post("/update", upload.single("profile"), updateTeacher);

// router.post("/delete", deleteTeacher);

module.exports = router;
