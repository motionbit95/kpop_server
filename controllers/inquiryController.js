"use strict";
const { response } = require("../app");
const firebase = require("../db");
const Inquiry = require("../models/inquiry");
const firestore = firebase.firestore();

const addInquiry = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdAt = new Date();
    const inquiry = await firestore.collection("INQUIRY").add(data);

    res.send({ ...data, id: inquiry.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getInquiry = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection("INQUIRY")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("No Inquiry Record found");
      } else {
        const data = new Inquiry(
          doc.id,
          doc.data().uid,
          doc.data().createdAt,
          doc.data().tag,
          doc.data().date,
          doc.data().state,
          doc.data().title,
          doc.data().details
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const getAllInquiry = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection("INQUIRY").get();
    const data = snapshot;
    const array = [];
    if (data.empty) {
      res.status(404).send("No Inquiry Record found");
    } else {
      snapshot.forEach((doc) => {
        const data = new Inquiry(
          doc.id,
          doc.data().uid,
          doc.data().createdAt,
          doc.data().tag,
          doc.data().date,
          doc.data().state,
          doc.data().title,
          doc.data().details
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

const updateInquiry = async (req, res, next) => {
  console.log("id : ", req.body.id);
  const inquiry = await firestore
    .collection("INQUIRY")
    .doc(req.body.id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteInquiry = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const data = await firestore.collection("INQUIRY").doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const searchInquiry = async (req, res) => {
  try {
    const { conditions } = req.body;

    let query = firestore.collection("INQUIRY");

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
  addInquiry,
  getInquiry,
  getAllInquiry,
  updateInquiry,
  deleteInquiry,
  searchInquiry,
};
