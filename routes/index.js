var express = require("express");
const {
  deleteAllCollections,
  addDummyData,
} = require("../controllers/adminController");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("KPOPSCHOOL SERVER RUNNING...");
});

// 전체지우기
router.get("/delete-all", async (req, res) => {
  try {
    if (req.body.password !== "kpopschool") {
      return res.status(400).send("password is not correct.");
    } else {
      await deleteAllCollections();
      res.status(200).send("All collections deleted successfully.");
    }
  } catch (error) {
    console.error("Error deleting collections: ", error);
    res.status(500).send("Error deleting collections.");
  }
});

router.get("/add-dummy", addDummyData);

module.exports = router;
