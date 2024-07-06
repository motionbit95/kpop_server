"use strict";
const firebase = require("../db");
const firestore = firebase.firestore();

const collectionName = "HOME";

const getHomeList = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    const data = snapshot;
    const array = [];
    if (data.empty) {
      res.status(404).send("No Home Record found");
    } else {
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        array.push(data);
      });

      res.send(array);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getHomeData = async (req, res, next) => {
  try {
    const snapshot = await firestore
      .collection(collectionName)
      .doc(req.params.id)
      .get();
    const data = { id: req.params.id, ...snapshot.data() };
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateHomeData = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  const data = await firestore
    .collection(collectionName)
    .doc(id)
    .update(req.body)
    .then(() => {
      res.send(id + " success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

module.exports = { getHomeList, getHomeData, updateHomeData };
