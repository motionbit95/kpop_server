const express = require("express");

const router = express.Router();
const {
  getHomeList,
  getHomeData,
  updateHomeData,
} = require("../controllers/homeController");

router.get("/list", getHomeList);

router.get("/get/:id", getHomeData);

router.post("/update", updateHomeData);

module.exports = router;
