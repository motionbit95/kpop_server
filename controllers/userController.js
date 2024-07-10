"use strict";
const firebase = require("../db");
const User = require("../models/users");
const firestore = firebase.firestore();

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bucket = admin.storage().bucket();

const collectionName = "USERS";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "motionbit.dev@gmail.com",
    pass: "ctwb eqcs oekk pnix",
  },
});

const addAuth = async (req, res, next) => {
  // 회원가입을 진행하고, 계정을 생성합니다. (이메일 / 패스워드)
  // post
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    if (userRecord) {
      await firestore
        .collection(collectionName)
        .doc(userRecord.uid)
        .set({
          createdAt: new Date(),
          ...req.body,
        });
    }

    res.status(200).send({
      message: `회원가입이 완료되었습니다.`,
      code: "success",
      id: userRecord.uid,
    });
    console.log("Successfully created new user:", userRecord.uid);
  } catch (error) {
    res.status(400).send({
      message: "[error] " + error.message,
      code: "error",
    });
  }
};

const deleteAuth = async (req, res, next) => {
  // 계정을 탈퇴합니다.
  // delete
  const firestore = admin.firestore();

  try {
    await firestore
      .collection(collectionName)
      .doc(req.params.id)
      .delete()
      .then(async () => {
        await admin
          .auth()
          .deleteUser(req.params.id)
          .then(async () => {
            res.send(`Successfully deleted user: ${req.params.id}`);
          });
      });
  } catch (error) {
    res.status(400).send(`Error deleting document: ${error.message}`);
  }
};

const sendEmail = async (req, res, next) => {
  // 계정 확인용 이메일을 전송합니다.
  const email = req.body.email;

  try {
    const user = await admin.auth().getUserByEmail(email);

    const verificationCode = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    // 임시로 사용자 데이터베이스에 verificationCode 저장
    await admin.firestore().collection("emailVerification").doc(user.uid).set({
      verificationCode: verificationCode,
      email: email,
    });

    const mailOptions = {
      from: `K-POP School <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "Here’s your  K-POP School membership registration verification code",
      html: `
        <p>Hello, this is K-POP School! We will provide you with a verification code for membership registration</p>
        <h1>${verificationCode}</h1>
        <p>- This email is for sending only, so you cannot reply to it</p>
        <p>- This email will provide you with a verification code to sign up for K-POP School membership</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("Verification email sent");
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const checkVerify = async (req, res, next) => {
  // 이메일 주소가 유효한지 확인합니다.
  const { email, code } = req.body;

  try {
    const snapshot = await admin
      .firestore()
      .collection("emailVerification")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(400).send("Invalid email or code");
    }

    let verificationCode;
    snapshot.forEach((doc) => {
      verificationCode = doc.data().verificationCode;
    });

    if (verificationCode === code) {
      // 인증 성공, 사용자의 이메일을 인증된 것으로 표시
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, {
        emailVerified: true,
      });

      // 인증 후 데이터베이스에서 코드 삭제
      await admin
        .firestore()
        .collection("emailVerification")
        .doc(user.uid)
        .delete();

      res.status(200).send("Email verified successfully");
    } else {
      res.status(400).send("Invalid email or code");
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const changePassword = async (req, res, next) => {
  const { uid, newPassword } = req.body;

  if (!uid || !newPassword) {
    return res.status(400).send("Missing parameters");
  }

  try {
    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    res.status(200).send("Successfully changed password");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Failed to change password");
  }
};

const addUser = async (req, res, next) => {
  try {
    if (!req.file) {
      const data = req.body;

      data.createdAt = new Date();

      const user = await firestore
        .collection(collectionName)
        .doc(data.id)
        .set(data);

      console.log("data : ", data, user);

      res.send({ ...data, id: user.id });
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
      data.profile = publicUrl;

      const user = await firestore.collection(collectionName).add(data);

      res.send({ ...data, id: user.id });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    const data = snapshot;
    const usersArray = [];
    if (data.empty) {
      res.status(404).send("No User Record found");
    } else {
      snapshot.forEach((doc) => {
        const user_data = new User(
          doc.id,
          doc.data().createdAt,
          doc.data().isTeacher,
          doc.data().profile,
          doc.data().name,
          doc.data().firstName,
          doc.data().email,
          doc.data().password,
          doc.data().interest,
          doc.data().experience,
          doc.data().birthday,
          doc.data().gender
        );
        usersArray.push(user_data);
      });
    }

    console.log(usersArray);
    res.send(usersArray);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUser = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  await firestore
    .collection(collectionName)
    .doc(id)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).send("No User Record found");
      } else {
        const data = new User(
          doc.id,
          doc.data().createdAt,
          doc.data().isTeacher,
          doc.data().profile,
          doc.data().name,
          doc.data().firstName,
          doc.data().email,
          doc.data().password,
          doc.data().interest,
          doc.data().experience,
          doc.data().birthday,
          doc.data().gender
        );

        res.send(data);
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const updateUser = async (req, res, next) => {
  const id = req.body.id;
  console.log("id : ", id);
  const data = await firestore
    .collection(collectionName)
    .doc(id)
    .update(req.body)
    .then(() => {
      res.send("success");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
};

const deleteUser = async (req, res, next) => {
  console.log("req.body : ", req.body);
  try {
    const id = req.body.id;
    console.log("id : ", id);
    const data = await firestore.collection(collectionName).doc(id).delete();
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
      .collection(collectionName) // 컬렉션 이름으로 변경하세요
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
  sendEmail,
  checkVerify,
  changePassword,
  addAuth,
  deleteAuth,
  addUser,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
  searchByKeyword,
};
