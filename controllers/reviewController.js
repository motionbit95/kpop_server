"use strict";
const { response } = require("../app");
const firebase = require("../db");
const Review = require("../models/review");
const firestore = firebase.firestore();

const collectionName = "REVIEW";

const addReview = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    const docRef = await firestore.collection(collectionName).add(data);

    res.send({ ...data, id: docRef.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getReview = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection(collectionName)
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("이벤트 문서를 찾을 수 없습니다.");
      } else {
        const data = new Review(
          doc.id,
          doc.data().createdAt,
          doc.data().teacherId,
          doc.data().userId,
          doc.data().lessonId,
          doc.data().rating,
          doc.data().comment
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const getAllReview = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    const data = snapshot;
    const array = [];
    if (data.empty) {
      res.status(404).send("No Review Record found");
    } else {
      snapshot.forEach((doc) => {
        const review = new Review(
          doc.id,
          doc.data().createdAt,
          doc.data().teacherId,
          doc.data().userId,
          doc.data().lessonId,
          doc.data().rating,
          doc.data().comment
        );
        array.push(review);
      });
    }

    console.log(array);
    res.send(array);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateReview = async (req, res, next) => {
  console.log("id : ", req.body.id);
  const faq = await firestore
    .collection(collectionName)
    .doc(req.body.id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteReview = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const teacher = await firestore.collection(collectionName).doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const searchReview = async (req, res) => {
  try {
    const { conditions } = req.body;

    let query = firestore.collection(collectionName);

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
  addReview,
  getReview,
  getAllReview,
  updateReview,
  deleteReview,
  searchReview,
};
