"use strict";
const db = require("../db");
const firebase = require("../db");
const Teacher = require("../models/teachers");
const firestore = firebase.firestore();

const admin = require("firebase-admin");
const bucket = admin.storage().bucket();

const addTeacher = async (req, res, next) => {
  try {
    if (!req.file) {
      const data = req.body;

      data.createdAt = new Date();
      data.rating = 0;
      data.student = 0;

      const teacher = await firestore
        .collection("TEACHERS")
        .doc(data.id)
        .set(data);

      res.send({ ...data, id: teacher.id });
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
      data.rating = 0;
      data.student = 0;
      data.profile = publicUrl;

      const teacher = await firestore.collection("TEACHERS").add(data);

      res.send({ ...data, id: teacher.id });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllTeachers = async (req, res, next) => {
  try {
    const snapshot = await firestore
      .collection("TEACHERS")
      .orderBy("createdAt")
      .get();
    const data = snapshot;
    const teachersArray = [];
    if (data.empty) {
      res.status(404).send("No User Record found");
    } else {
      snapshot.forEach((doc) => {
        const teacher_data = new Teacher(
          doc.id,
          doc.data().createdAt,
          doc.data().category,
          doc.data().name,
          doc.data().career,
          doc.data().rating,
          doc.data().review,
          doc.data().student,
          doc.data().profile
        );
        teachersArray.push(teacher_data);
      });
    }

    console.log(teachersArray);
    res.send(teachersArray);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTeacher = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection("TEACHERS")
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("No User Record found");
      } else {
        const data = new Teacher(
          doc.id,
          doc.data().createdAt,
          doc.data().category,
          doc.data().name,
          doc.data().career,
          doc.data().rating,
          doc.data().review,
          doc.data().student,
          doc.data().profile
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const updateTeacher = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  const data = await firestore
    .collection("TEACHERS")
    .doc(id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteTeacher = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const data = await firestore.collection("TEACHERS").doc(id).delete();
    res.send("success");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// 필드와 키워드로 검색하는 엔드포인트
const searchByKeyword = async (req, res) => {
  const { field, keyword } = req.body;

  if (!field || !keyword) {
    return res.status(400).json({ msg: "Field and keyword are required" });
  }

  try {
    const querySnapshot = await firestore
      .collection("TEACHERS") // 컬렉션 이름으로 변경하세요
      .where(field, ">=", keyword)
      .where(field, "<=", keyword + "\uf8ff")
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ msg: "No matching documents." });
    }

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });

    res.json(results);
  } catch (err) {
    console.error("Error searching documents:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addTeacher,
  getAllTeachers,
  deleteTeacher,
  getTeacher,
  updateTeacher,
  searchByKeyword,
};
