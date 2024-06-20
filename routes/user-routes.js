const express = require("express");
const {
  addAuth,
  deleteAuth,
  sendEmail,
  checkVerify,
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  changePassword,
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

router.post("/changePassword", changePassword);

router.post("/add", addUser);

router.get("/list", getAllUsers);

router.post("/get", getUser);

router.post("/update", updateUser);

router.post("/delete", deleteUser);

module.exports = router;
