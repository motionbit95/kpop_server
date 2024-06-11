"use strict";
const { response } = require("../app");
const firebase = require("../db");
const Event = require("../models/event");
const db = firebase.firestore();

const admin = require("firebase-admin");

// Firestore 내의 모든 문서를 삭제하는 함수
async function deleteCollection(collectionRef) {
  const snapshot = await collectionRef.get();
  const batchSize = snapshot.size;

  if (batchSize === 0) {
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // 재귀적으로 다음 배치를 삭제
  process.nextTick(() => {
    deleteCollection(collectionRef);
  });
}
// 모든 컬렉션을 삭제하는 함수 (하드코딩된 컬렉션 이름 사용)
async function deleteAllCollections() {
  const collections = ["TEACHERS", "EVENTS", "FAQ"]; // 삭제할 컬렉션 이름들

  for (const collectionName of collections) {
    const collectionRef = db.collection(collectionName);
    await deleteCollection(collectionRef);
  }
}

async function addDummyData(req, res) {
  try {
    await addDummyEvent();
    await addDummyTeacher();
    await addDummyFAQ();
    res.send("dummy data added successfully.");
  } catch (error) {
    console.error("Error adding dummy data: ", error);
    res.status(500).send("Error adding dummy data.");
  }
}

async function addDummyEvent() {
  const dummyEvents = [
    {
      index: 0,
      title: "BIG OPENING SALE",
      description:
        "K-Pop School is open! To celebrate the opening, we're giving you a discount coupon! Please refer to the instructions below to register the coupon.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event1.png?alt=media&token=6b01cfac-ee0b-4bc8-b59c-f6532568d834",
      createdAt: new Date(),
    },
    {
      index: 1,
      title: "SPECIAL PROMOTION",
      description:
        "Get ready for our Special Promotion! To thank you for your continued support, we're offering an exclusive discount. Follow the instructions below to claim your special offer and enjoy amazing savings on your favorite items.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event2.png?alt=media&token=42afe3b0-85ab-473b-8277-47731ecf0909",
      createdAt: new Date(),
    },
    {
      index: 2,
      title: "BLACK FIRDAY",
      description:
        "Black Friday is here! Don't miss out on our biggest sale of the year. We're offering unbeatable discounts across our entire range. Check the instructions below to find out how you can take advantage of these incredible deals.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event3.png?alt=media&token=f39f2eaa-8157-4c15-89ba-1bfaaab51533",
      createdAt: new Date(),
    },
    {
      index: 3,
      title: "60% SUPER SALE",
      description:
        "Welcome to our 60% Super Sale! For a limited time, we're slashing prices by up to 60% on select products. Follow the instructions below to redeem your discount and make the most of this amazing offer.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event4.png?alt=media&token=33db242e-9cf4-4c93-9f64-bab70e860d9b",
      createdAt: new Date(),
    },
  ];

  for (const dummyEvent of dummyEvents) {
    await db.collection("EVENTS").add(dummyEvent);
  }
}

async function addDummyTeacher() {
  const dummyTeachers = [
    {
      name: "Lee Hwan Ho",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile1.png?alt=media&token=fd5abbc8-38ae-4067-a5e3-0bc136b1755c",
      category: "Vocal",
      career: `- SM entertainment vocal trainer
- Selling multiple albums and participating in chorus sessions
- Whee-sung, Ali, URBAN ZAKAPA, DAY6, N.Flying, etc. Vocal Trainer`,
      createdAt: new Date(),
      rating: 4,
      review: 15,
      student: 3560,
    },
    {
      name: "Jessie",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile2.png?alt=media&token=7ef93bbb-024c-4c43-a383-a9c187840c3e",
      category: "Vocal",
      career: `- SM, iNetwork entertainmen vocal trainer
- Vocal trainer for 2Eyes, Red Velvet, MOMOLAND, Lee Hae Yi
- Actor vocal trainer (Kim So Jung, Kim Yoo Jung, Lee Yoo Bi, Lee Soo Kyung, etc.)
- Various broadcast programs (Producer 101, King of Masked, K-POP star, etc.)`,
      createdAt: new Date(),
      rating: 4,
      review: 15,
      student: 3560,
    },
    {
      name: "Hyemi Park",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile3.png?alt=media&token=2d874079-37e9-472f-97cb-520dba7d9276",
      category: "Dance",
      career: `SM entertainment / Nega network Entertainment / Maru Entertainment Choreography Trainer`,
      createdAt: new Date(),
      rating: 4,
      review: 15,
      student: 3560,
    },
    {
      name: "ZEN",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile4.png?alt=media&token=f72d4aab-81cf-4821-8869-bfdc4af93863",
      category: "Dance",
      career: `- Professor of K-POP at Kangdong University and HOWON University
- Concert dancer / Training`,
      createdAt: new Date(),
      rating: 4,
      review: 15,
      student: 3560,
    },
    {
      name: "Rose",
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile5.png?alt=media&token=f34348e9-7c98-40da-840e-95320007fcad",
      category: "Dance",
      career: `- SM Entertainment Choreography Trainer
- ADIDAS stella event performance director`,
      createdAt: new Date(),
      rating: 4,
      review: 15,
      student: 3560,
    },
  ];

  for (const dummyTeacher of dummyTeachers) {
    await db.collection("TEACHERS").add(dummyTeacher);
  }
}

async function addDummyFAQ() {
  const dummyFAQs = [
    {
      index: 0,
      createdAt: new Date(),
      question: "How do I pay?",
      answer:
        "You can pay using various methods such as credit card, debit card, PayPal, or bank transfer. Simply follow the instructions at checkout to complete your payment securely.",
    },
    {
      index: 1,
      createdAt: new Date(),
      question: "Video playback error",
      answer:
        "If you're experiencing a video playback error, try refreshing the page or clearing your browser's cache. If the problem persists, check your internet connection or try using a different browser. For further assistance, please contact our support team.",
    },
    {
      index: 2,
      createdAt: new Date(),
      question: "AI playback error",
      answer:
        "If you're encountering an AI playback error, please ensure that your device meets the minimum system requirements and that your software is up-to-date. Restart the application and try again. If the issue continues, contact our technical support for help.",
    },
    {
      index: 3,
      createdAt: new Date(),
      question:
        "When the loading screen lasts more than 1 minute during payment",
      answer:
        "If the loading screen lasts more than 1 minute during payment, please do not refresh the page. Wait a few more moments, and if the issue persists, check your internet connection. If necessary, restart your browser and try the payment process again. If the problem continues, contact our customer service for assistance.",
    },
    {
      index: 4,
      createdAt: new Date(),
      question: "Changing lesson course",
      answer:
        "To change your lesson course, please log into your account and navigate to the 'My Courses' section. From there, select the course you wish to change and follow the instructions provided. If you need additional help, contact our support team.",
    },
    {
      index: 5,
      createdAt: new Date(),
      question: "Class refund information",
      answer:
        "For class refund information, please refer to our refund policy available on our website. Generally, refunds are issued if the request is made within a certain timeframe from the start of the course. To initiate a refund, contact our customer service team with your order details and reason for the refund request.",
    },
  ];
  for (const dummyFAQ of dummyFAQs) {
    await db.collection("FAQ").add(dummyFAQ);
  }
}

module.exports = { deleteAllCollections, addDummyData };
