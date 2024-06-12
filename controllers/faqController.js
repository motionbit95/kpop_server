"use strict";
const { response } = require("../app");
const firebase = require("../db");
const FAQ = require("../models/faq");
const firestore = firebase.firestore();

const addFAQ = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    const faq = await firestore.collection("FAQ").add(data);

    res.send({ ...data, id: faq.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getFAQ = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection("FAQ")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("이벤트 문서를 찾을 수 없습니다.");
      } else {
        const data = new FAQ(
          doc.id,
          doc.data().index,
          doc.data().createdAt,
          doc.data().question,
          doc.data().answer
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const getAllFAQ = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection("FAQ").get();
    const data = snapshot;
    const faqArray = [];
    if (data.empty) {
      res.status(404).send("No User Record found");
    } else {
      snapshot.forEach((doc) => {
        const faq_data = new FAQ(
          doc.id,
          doc.data().index,
          doc.data().createdAt,
          doc.data().question,
          doc.data().answer
        );
        faqArray.push(faq_data);
      });
    }

    console.log(faqArray);
    res.send(faqArray);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateFAQ = async (req, res, next) => {
  console.log("id : ", req.body.id);
  const faq = await firestore
    .collection("FAQ")
    .doc(req.body.id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteFAQ = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const teacher = await firestore.collection("FAQ").doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addFAQ,
  getFAQ,
  getAllFAQ,
  updateFAQ,
  deleteFAQ,
};
