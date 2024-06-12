const express = require("express");

const router = express.Router();
const {
  addCurriculum,
  getCurriculum,
  getAllCurriculum,
  updateCurriculum,
  deleteCurriculum,
  searchCurriculum,
} = require("../controllers/curriculumController");

router.post("/add", addCurriculum);

router.get("/list", getAllCurriculum);

router.post("/get", getCurriculum);

router.post("/update", updateCurriculum);

router.post("/delete", deleteCurriculum);

router.post("/search", searchCurriculum);

module.exports = router;
