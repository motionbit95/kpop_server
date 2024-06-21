"use strict";
const firebase = require("../db");
const Event = require("../models/event");
const firestore = firebase.firestore();

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

const addEvent = async (req, res, next) => {
  try {
    if (!req.file) {
      const data = req.body;

      data.createdAt = new Date();

      const event = await firestore.collection("EVENTS").add(data);

      res.send({ ...data, id: event.id });
      return;
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Something went wrong!");
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log("데이터 : ", req.body, publicUrl);
      const data = req.body;

      data.createdAt = new Date();
      data.thumbnail = publicUrl;

      const event = await firestore.collection("EVENTS").add(data);

      res.send({ ...data, id: event.id });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection("EVENTS").get();
    const data = snapshot;
    const array = [];
    if (data.empty) {
      res.status(404).send("이벤트 목록이 없습니다.");
    } else {
      snapshot.forEach((doc) => {
        const data = new Event(
          doc.id,
          doc.data().index,
          doc.data().createdAt,
          doc.data().thumbnail,
          doc.data().title,
          doc.data().description
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

const getEvent = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection("EVENTS")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("이벤트 문서를 찾을 수 없습니다.");
      } else {
        const data = new Event(
          doc.id,
          doc.data().index,
          doc.data().createdAt,
          doc.data().thumbnail,
          doc.data().title,
          doc.data().description
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const updateEvent = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  const teacher = await firestore
    .collection("EVENTS")
    .doc(id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteEvent = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const data = await firestore.collection("EVENTS").doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
