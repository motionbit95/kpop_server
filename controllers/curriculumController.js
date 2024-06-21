"use strict";
const firebase = require("../db");
const Curriculum = require("../models/curriculums");
const firestore = firebase.firestore();

const addCurriculum = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    const curriculum = await firestore.collection("CURRICULUMS").add(data);

    res.send({ ...data, id: curriculum.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCurriculum = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection("CURRICULUMS")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("커리큘럼 문서를 찾을 수 없습니다.");
      } else {
        const data = new Curriculum(
          doc.id,
          doc.data().title,
          doc.data().image,
          doc.data().createdAt,
          doc.data().teacherId,
          doc.data().category,
          doc.data().format,
          doc.data().month,
          doc.data().totalSessions,
          doc.data().sessions,
          doc.data().price,
          doc.data().description,
          doc.data().difficulty,
          doc.data().likes,
          doc.data().review,
          doc.data().student
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const getAllCurriculum = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection("CURRICULUMS").get();
    const data = snapshot;
    const array = [];
    if (data.empty) {
      res.status(404).send("No User Record found");
    } else {
      snapshot.forEach((doc) => {
        const data = new Curriculum(
          doc.id,
          doc.data().title,
          doc.data().image,
          doc.data().createdAt,
          doc.data().teacherId,
          doc.data().category,
          doc.data().format,
          doc.data().month,
          doc.data().totalSessions,
          doc.data().sessions,
          doc.data().price,
          doc.data().description,
          doc.data().difficulty,
          doc.data().likes,
          doc.data().review,
          doc.data().student
        );
        array.push(data);
      });
    }

    console.log(array);
    res.send(array);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCurriculum = async (req, res, next) => {
  console.log("id : ", req.body.id);
  const data = await firestore
    .collection("CURRICULUMS")
    .doc(req.body.id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteCurriculum = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const data = await firestore.collection("CURRICULUMS").doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const searchCurriculum = async (req, res) => {
  try {
    const { conditions } = req.body;

    let query = firestore.collection("CURRICULUMS");

    conditions.forEach((condition) => {
      query = query.where(condition.field, condition.operator, condition.value);
    });

    const snapshot = await query.get();
    if (snapshot.empty) {
      return res.status(404).send("No matching documents.");
    }

    let results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching documents:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addCurriculum,
  getCurriculum,
  getAllCurriculum,
  updateCurriculum,
  deleteCurriculum,
  searchCurriculum,
};
