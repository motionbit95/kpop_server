"use strict";
const firebase = require("../db");
const Event = require("../models/event");
const db = firebase.firestore();
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const admin = require("firebase-admin");
const { strLink } = require("fs");
const bucket = admin.storage().bucket();

// 이미지 업로드 엔드포인트
async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const blob = bucket.file(uuidv4() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async () => {
      // Public URL 만들기
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ imageUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

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
  const collections = [
    "TEACHERS",
    "EVENTS",
    "FAQ",
    "CURRICULUM",
    "INQUIRY",
    "USERS",
    "emailVerification",
  ]; // 삭제할 컬렉션 이름들

  for (const collectionName of collections) {
    const collectionRef = db.collection(collectionName);
    await deleteCollection(collectionRef);
  }
}

async function addDummyData(req, res) {
  try {
    // await addDummyEvent();
    // await addDummyTeacher();
    // await addDummyFAQ();
    // await addDummyCurriculum();
    // await addDummyInquiry();
    // await addDummyUser();
    await addDummyReview();
    // await addDummyHome();
    res.send("dummy data added successfully.");
  } catch (error) {
    console.error("Error adding dummy data: ", error);
    res.status(500).send("Error adding dummy data.");
  }
}

async function addDummyEvent() {
  const dummyEvents = [
    {
      id: "5pQQCrzgegvVs3SxrPyv",
      index: 0,
      title: "BIG OPENING SALE",
      description:
        "K-Pop School is open! To celebrate the opening, we're giving you a discount coupon! Please refer to the instructions below to register the coupon.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event1.png?alt=media&token=6b01cfac-ee0b-4bc8-b59c-f6532568d834",
      createdAt: new Date(),
      discountType: "%",
      discountAmount: 10,
      deadline_start: new Date(2024, 7, 1),
      deadline_end: new Date(2024, 7, 10),
      use_start: new Date(2024, 7, 1),
      use_end: new Date(2024, 7, 15),
    },
    {
      id: "Yl9NlVh2JAdG5dZtekif",
      index: 1,
      title: "SPECIAL PROMOTION",
      description:
        "Get ready for our Special Promotion! To thank you for your continued support, we're offering an exclusive discount. Follow the instructions below to claim your special offer and enjoy amazing savings on your favorite items.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event2.png?alt=media&token=42afe3b0-85ab-473b-8277-47731ecf0909",
      createdAt: new Date(),
      discountType: "dollor",
      discountAmount: 20,
      deadline_start: new Date(2024, 7, 1),
      deadline_end: new Date(2024, 7, 30),
      use_start: new Date(2024, 7, 1),
      use_end: new Date(2024, 8, 15),
    },
    {
      id: "fGoDaD51M3AHIetLeEF9",
      index: 2,
      title: "BLACK FIRDAY",
      description:
        "Black Friday is here! Don't miss out on our biggest sale of the year. We're offering unbeatable discounts across our entire range. Check the instructions below to find out how you can take advantage of these incredible deals.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event3.png?alt=media&token=f39f2eaa-8157-4c15-89ba-1bfaaab51533",
      createdAt: new Date(),
      discountType: "dollor",
      discountAmount: 10,
      deadline_start: new Date(2024, 7, 1),
      deadline_end: new Date(2024, 7, 8),
      use_start: new Date(2024, 7, 8),
      use_end: new Date(2024, 7, 16),
    },
    {
      id: "j3KmtBCNRpU8M2GQzFKl",
      index: 3,
      title: "60% SUPER SALE",
      description:
        "Welcome to our 60% Super Sale! For a limited time, we're slashing prices by up to 60% on select products. Follow the instructions below to redeem your discount and make the most of this amazing offer.",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/event4.png?alt=media&token=33db242e-9cf4-4c93-9f64-bab70e860d9b",
      createdAt: new Date(),
      discountType: "dollor",
      discountAmount: 10,
      deadline_start: new Date(2024, 7, 1),
      deadline_end: new Date(2024, 7, 9),
      use_start: new Date(2024, 7, 9),
      use_end: new Date(2024, 7, 12),
    },
  ];

  for (const dummyEvent of dummyEvents) {
    await db.collection("EVENTS").doc(dummyEvent.id).set(dummyEvent);
  }
}

async function addDummyTeacher() {
  const dummyTeachers = [
    {
      id: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
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
      id: "ARsT5Xayo7VBb3sZqHde9snKm9s1",
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
      id: "39XYlrd170gcru4DMoUjvErlHj02",
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
      id: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
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
      id: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      name: "ROSE",
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
    await db.collection("TEACHERS").doc(dummyTeacher.id).set(dummyTeacher);
  }
}

async function addDummyFAQ() {
  const dummyFAQs = [
    {
      id: "BBzx28RBnXGJmN7DNK3n",
      index: 0,
      createdAt: new Date(),
      question: "How do I pay?",
      answer:
        "You can pay using various methods such as credit card, debit card, PayPal, or bank transfer. Simply follow the instructions at checkout to complete your payment securely.",
    },
    {
      id: "FD55j1C8tthUW9NH6M1O",
      index: 1,
      createdAt: new Date(),
      question: "Video playback error",
      answer:
        "If you're experiencing a video playback error, try refreshing the page or clearing your browser's cache. If the problem persists, check your internet connection or try using a different browser. For further assistance, please contact our support team.",
    },
    {
      id: "JvdDEt4Lf9WLCXx5E8cW",
      index: 2,
      createdAt: new Date(),
      question: "AI playback error",
      answer:
        "If you're encountering an AI playback error, please ensure that your device meets the minimum system requirements and that your software is up-to-date. Restart the application and try again. If the issue continues, contact our technical support for help.",
    },
    {
      id: "M1YPRXRa1mU2WK5ygzUx",
      index: 3,
      createdAt: new Date(),
      question:
        "When the loading screen lasts more than 1 minute during payment",
      answer:
        "If the loading screen lasts more than 1 minute during payment, please do not refresh the page. Wait a few more moments, and if the issue persists, check your internet connection. If necessary, restart your browser and try the payment process again. If the problem continues, contact our customer service for assistance.",
    },
    {
      id: "NctGrkZnhEuciH5tpJVy",
      index: 4,
      createdAt: new Date(),
      question: "Changing lesson course",
      answer:
        "To change your lesson course, please log into your account and navigate to the 'My Courses' section. From there, select the course you wish to change and follow the instructions provided. If you need additional help, contact our support team.",
    },
    {
      id: "mYm3LaOzMByO6WELFFTm",
      index: 5,
      createdAt: new Date(),
      question: "Class refund information",
      answer:
        "For class refund information, please refer to our refund policy available on our website. Generally, refunds are issued if the request is made within a certain timeframe from the start of the course. To initiate a refund, contact our customer service team with your order details and reason for the refund request.",
    },
  ];
  for (const dummyFAQ of dummyFAQs) {
    await db.collection("FAQ").doc(dummyFAQ.id).set(dummyFAQ);
  }
}

async function addDummyCurriculum() {
  const dummyCurriculums = [
    {
      id: "03t4MxT2ErsO1c3OEWXJ",
      title: "Basic Vocal",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      category: "Vocal",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "80",
      description:
        "There's a saying that goes in half. Learn basic vocalizations and breathing techniques to sing. Basic vocalizations are learned to correct inaccurate pronunciations and increase the volume when on stage, and breathing techniques are learned to communicate emotions while singing or breathe properly. Master your assignment and get ready for the next step.",
      difficulty: "Beginner",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "08/07/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "15/07/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "22/07/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "29/07/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "06/08/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "13/08/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "20/08/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "27/08/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "03/09/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/09/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/09/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/09/24",
          startTime: "08:00",
          endTime: "10:00",
          location: "LA",
        },
      ],
    },
    {
      id: "2be2cLY8FFSXFyijHS7q",
      title: "Vocal Pitch",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      category: "Vocal",
      format: "1:1",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "85",
      description:
        "If the foundation work for singing is completed, the next step is to draw out the right pitch for the song. Each singer analyzes his or her different ranges, finds a range that suits him or her, and selects and practices the right song.",
      difficulty: "Intermediate",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "08/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "15/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "22/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "29/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "06/08/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "13/08/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "20/08/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "27/08/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "03/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
      ],
    },
    {
      id: "f8byokTqzpPcCAhXPoOR",
      title: "Emotional song",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      category: "Vocal",
      format: "VOD",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "90",
      description:
        "Try to capture your emotions in the song. The song makes people emotional, and it requires your effort. Learn breathing techniques and techniques to move people's minds. Enrich your assignment songs with many skills such as vibrations, stopping breathing, and singing high notes.",
      difficulty: "Advanced",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "09/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "16/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "23/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "30/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "05/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "12/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "19/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "26/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
      ],
    },
    {
      id: "5tzp5WjRAgI7EBBhhbA8",
      title: "Debut or Die",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      category: "Vocal",
      format: "1:1",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "99",
      description:
        "The moment of destiny has come. The curriculum teaches students to think that you are on the verge of debuting. It teaches them tips on basic manners at auditions as well as how to sing, such as skills, techniques, and attitudes toward music.",
      difficulty: "Professional",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "09/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "16/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "23/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "30/07/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "05/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "12/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "19/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "26/09/24",
          startTime: "07:30",
          endTime: "09:30",
          location: "LA",
        },
      ],
    },
    {
      id: "9g5ofRWDP319qyaWXJtp",
      title: "Vocal Pitch",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "ARsT5Xayo7VBb3sZqHde9snKm9s1",
      category: "Vocal",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "80",
      description:
        "There's a saying that goes in half. Learn basic vocalizations and breathing techniques to sing. Basic vocalizations are learned to correct inaccurate pronunciations and increase the volume when on stage, and breathing techniques are learned to communicate emotions while singing or breathe properly. Master your assignment and get ready for the next step.",
      difficulty: "Beginner",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "31/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "04/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
      ],
    },
    {
      id: "FJlLZ2k0mYmVOluvqsVQ",
      title: "Technical skill",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "ARsT5Xayo7VBb3sZqHde9snKm9s1",
      category: "Vocal",
      format: "1:1",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "85",
      description:
        "If the foundation work for singing is completed, the next step is to draw out the right pitch for the song. Each singer analyzes his or her different ranges, finds a range that suits him or her, and selects and practices the right song.",
      difficulty: "Intermediate",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "31/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "04/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
      ],
    },
    {
      id: "G1qrc9SOrNyyuYDS4iMA",
      title: "Intergrated singing",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum1.png?alt=media&token=4e326c75-381e-42a9-aed9-b449f2938148",
      createdAt: new Date(),
      teacherId: "ARsT5Xayo7VBb3sZqHde9snKm9s1",
      category: "Vocal",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "80",
      description:
        "Try to capture your emotions in the song. The song makes people emotional, and it requires your effort. Learn breathing techniques and techniques to move people's minds. Enrich your assignment songs with many skills such as vibrations, stopping breathing, and singing high notes.",
      difficulty: "Advanced",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "31/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "04/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
      ],
    },
    {
      id: "CVBC8oJrRndidxmAnBfp",
      title: "Catching Movements",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "39XYlrd170gcru4DMoUjvErlHj02",
      category: "Dance",
      format: "1:1",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: 85,
      description:
        "If the foundation work for singing is completed, the next step is to draw out the right pitch for the song. Each singer analyzes his or her different ranges, finds a range that suits him or her, and selects and practices the right song.",
      difficulty: "Intermediate",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "10/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "17/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "24/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "31/07/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "07/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "14/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "21/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "28/08/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "04/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "07:00",
          endTime: "09:00",
          location: "LA",
        },
      ],
    },
    {
      id: "fxkBxqg1rr5wyuLCN02k",
      title: "Group Dance",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "39XYlrd170gcru4DMoUjvErlHj02",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: 90,
      description:
        "Try to capture your emotions in the song. The song makes people emotional, and it requires your effort. Learn breathing techniques and techniques to move people's minds. Enrich your assignment songs with many skills such as vibrations, stopping breathing, and singing high notes.",
      difficulty: "Advanced",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
      ],
    },
    {
      id: "i6gzkYDOhGqWhdnzIhgp",
      title: "Choreography",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "39XYlrd170gcru4DMoUjvErlHj02",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: 99,
      description:
        "The moment of destiny has come. The curriculum teaches students to think that you are on the verge of debuting. It teaches them tips on basic manners at auditions as well as how to sing, such as skills, techniques, and attitudes toward music.",
      difficulty: "Professional",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
      ],
    },
    {
      id: "iKHLfKSCiWTFz7nJIr0a",
      title: "Challenge",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "80",
      description:
        "There's a saying that goes in half. Learn basic vocalizations and breathing techniques to sing. Basic vocalizations are learned to correct inaccurate pronunciations and increase the volume when on stage, and breathing techniques are learned to communicate emotions while singing or breathe properly. Master your assignment and get ready for the next step.",
      difficulty: "Beginner",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
      ],
    },
    {
      id: "vkQjRjBm1qa8vyLZ95fB",
      title: "Shorts Analysis",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "85",
      description:
        "If the foundation work for singing is completed, the next step is to draw out the right pitch for the song. Each singer analyzes his or her different ranges, finds a range that suits him or her, and selects and practices the right song.",
      difficulty: "Intermediate",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/09/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/11/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/12/24",
          startTime: "06:00",
          endTime: "08:00",
          location: "LA",
        },
      ],
    },
    {
      id: "wdlJ7NQJcV9wJuoihSaa",
      title: "Group Dance",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "90",
      description:
        "Try to capture your emotions in the song. The song makes people emotional, and it requires your effort. Learn breathing techniques and techniques to move people's minds. Enrich your assignment songs with many skills such as vibrations, stopping breathing, and singing high notes.",
      difficulty: "Advanced",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "01/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "08/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "15/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "22/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "29/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "05/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "12/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "19/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "26/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
      ],
    },
    {
      id: "zenTYk73llpKtujPizpL",
      title: "Choreography",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "99",
      description:
        "The moment of destiny has come. The curriculum teaches students to think that you are on the verge of debuting. It teaches them tips on basic manners at auditions as well as how to sing, such as skills, techniques, and attitudes toward music.",
      difficulty: "Professional",
      likes: "532",
      review: "15",
      student: "3560",
      classes: [
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "11/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "18/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "25/07/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "01/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "08/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "15/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "22/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "29/08/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "05/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "12/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "19/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
        {
          title: "class title",
          details:
            "class details, not very long. Description of 50 characters or less No more than two lines at most.",
          link: "https://us05web.zoom.us/j/84497076142?pwd=W4mRB4mOKcAGAhKRhbxLl5fYJdf9YX.1",
          file: "",
          date: "26/09/24",
          startTime: "09:00",
          endTime: "11:00",
          location: "LA",
        },
      ],
    },
    {
      id: "IAsgKYQo27yljfJH8knV",
      title: "Challenge",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "80",
      description:
        "There's a saying that goes in half. Learn basic vocalizations and breathing techniques to sing. Basic vocalizations are learned to correct inaccurate pronunciations and increase the volume when on stage, and breathing techniques are learned to communicate emotions while singing or breathe properly. Master your assignment and get ready for the next step.",
      difficulty: "Beginner",
      likes: "532",
      review: "15",
      student: "3560",
    },
    {
      id: "IdAcpwrya7OGZpzsm6dc",
      title: "Shorts Analysis",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "85",
      description:
        "If the foundation work for singing is completed, the next step is to draw out the right pitch for the song. Each singer analyzes his or her different ranges, finds a range that suits him or her, and selects and practices the right song.",
      difficulty: "Intermediate",
      likes: "532",
      review: "15",
      student: "3560",
    },
    {
      id: "IpJjqgU2ZHJa9dX06LK1",
      title: "Gesture Study",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "90",
      description:
        "Try to capture your emotions in the song. The song makes people emotional, and it requires your effort. Learn breathing techniques and techniques to move people's minds. Enrich your assignment songs with many skills such as vibrations, stopping breathing, and singing high notes.",
      difficulty: "Advanced",
      likes: "532",
      review: "15",
      student: "3560",
    },
    {
      id: "w3Lc3ugDydKGaBWe1LoU",
      title: "DETAILS",
      image:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/curriculum2.png?alt=media&token=4461f570-06bd-4593-add3-b0de66233af7",
      createdAt: new Date(),
      teacherId: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      category: "Dance",
      format: "1:6",
      month: "3",
      totalSessions: "12",
      sessions: "2",
      price: "99",
      description:
        "The moment of destiny has come. The curriculum teaches students to think that you are on the verge of debuting. It teaches them tips on basic manners at auditions as well as how to sing, such as skills, techniques, and attitudes toward music.",
      difficulty: "Professional",
      likes: "532",
      review: "15",
      student: "3560",
    },
  ];

  for (const dummyCurriculum of dummyCurriculums) {
    await db
      .collection("CURRICULUMS")
      .doc(dummyCurriculum.id)
      .set(dummyCurriculum);
  }
}

async function addDummyInquiry() {
  let now = new Date();
  const dummyInquiries = [
    {
      id: "1",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate payment on January",
      date: `07-10-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am writing to bring to your attention an issue regarding a duplicate payment in January. It appears that my account has been charged twice for the same transaction in that month.
  
  Could you please investigate this matter and initiate a refund for the duplicate charge at your earliest convenience? I have attached the relevant transaction details for your reference.
  
  Thank you for your prompt attention to this matter.
  
  Best regards,
  Jane Smith`,
    },
    {
      id: "2",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Incorrect amount charged",
      date: `07-09-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I noticed an incorrect amount charged to my account. The charge is much higher than expected and I suspect it might be a duplicate.
  
  Can you please review the transaction and process a refund if necessary? I have attached my transaction details for your reference.
  
  Thank you for your cooperation.
  
  Sincerely,
  Alex Johnson`,
    },
    {
      id: "3",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Double charge for same service",
      date: `07-08-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am contacting you regarding a double charge for the same service. My account was billed twice for a single service in February.
  
  Please investigate this and issue a refund for the duplicate charge. I have included the transaction details for your review.
  
  Thanks for your prompt attention.
  
  Regards,
  Emily Davis`,
    },
    {
      id: "4",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Unrecognized duplicate charge",
      date: `07-07-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I recently found an unrecognized duplicate charge on my account. I did not authorize multiple payments for this transaction.
  
  Can you please look into this and process a refund for the extra charge? The transaction details are attached.
  
  Thank you for your help.
  
  Best,
  Michael Brown`,
    },
    {
      id: "5",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Overcharged for subscription",
      date: `07-06-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  It appears that I have been overcharged for my subscription this month. There are two charges for the same period.
  
  Please review and refund the duplicate charge. Attached are the details of the transactions.
  
  Thank you for addressing this issue promptly.
  
  Best regards,
  Linda Green`,
    },
    {
      id: "6",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate billing for service",
      date: `07-05-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I noticed a duplicate billing for the service I received last week. My account was charged twice on the same day.
  
  Could you please verify this and issue a refund for the duplicate payment? The transaction details are enclosed.
  
  Thank you for your swift action.
  
  Regards,
  Robert Wilson`,
    },
    {
      id: "7",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Refund request for double charge",
      date: `07-04-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am writing to request a refund for a double charge on my account. This error occurred during the last billing cycle.
  
  Please look into this matter and process a refund at your earliest convenience. The transaction details are attached for your reference.
  
  Thank you for your prompt response.
  
  Sincerely,
  Patricia White`,
    },
    {
      id: "8",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate transaction issue",
      date: `07-03-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I have an issue with a duplicate transaction on my account. I was billed twice for the same service.
  
  Can you please investigate and issue a refund for the duplicate charge? I have included the transaction details.
  
  Thank you for your assistance.
  
  Best,
  David Martinez`,
    },
    {
      id: "9",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Billing error: double charge",
      date: `07-02-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I discovered a billing error on my account where I was charged twice for the same service. This needs to be corrected.
  
  Please review the transactions and process a refund for the duplicate charge. The details are attached for your convenience.
  
  Thank you for your prompt attention to this matter.
  
  Best regards,
  Charles Clark`,
    },
    {
      id: "10",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate charge complaint",
      date: `07-01-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am writing to complain about a duplicate charge on my account. It appears I was billed twice for the same service last month.
  
  Could you please look into this and refund the extra charge? The transaction details are provided below.
  
  Thank you for your prompt assistance.
  
  Sincerely,
  Anna Hall`,
    },
    {
      id: "11",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Double charge on my account",
      date: `06-30-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I have noticed a double charge on my account for the same service. This appears to be an error.
  
  Please verify and refund the duplicate charge as soon as possible. I have attached the transaction details for your review.
  
  Thank you for your cooperation.
  
  Regards,
  Sophia Lewis`,
    },
    {
      id: "12",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate payment issue",
      date: `06-29-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am contacting you regarding a duplicate payment issue on my account. My account was charged twice for the same service on the same day.
  
  Please investigate this matter and process a refund for the duplicate payment. The transaction details are enclosed for your reference.
  
  Thank you for your attention to this matter.
  
  Sincerely,
  James King`,
    },
    {
      id: "13",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Double billing error",
      date: `06-28-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I noticed a double billing error on my account. There are two charges for the same service on different dates.
  
  Can you please review the charges and issue a refund for the duplicate amount? The transaction details are attached.
  
  Thank you for your prompt action.
  
  Best,
  Olivia Walker`,
    },
    {
      id: "14",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Overcharged for service",
      date: `06-27-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I have been overcharged for the service this month. There are duplicate charges on my account.
  
  Please investigate and refund the extra charge. I have attached the transaction details for your reference.
  
  Thank you for your assistance.
  
  Best regards,
  Henry Robinson`,
    },
    {
      id: "15",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate payment notice",
      date: `06-26-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  This is to notify you of a duplicate payment on my account. I have been charged twice for the same service last week.
  
  Could you please look into this and process a refund for the duplicate charge? The transaction details are enclosed.
  
  Thank you for your prompt attention.
  
  Regards,
  Lucas Scott`,
    },
    {
      id: "16",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Double charge issue",
      date: `06-25-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am experiencing a double charge issue on my account. My account was billed twice for a single service in March.
  
  Please investigate this matter and refund the duplicate charge. The transaction details are attached.
  
  Thank you for your cooperation.
  
  Sincerely,
  Jessica Turner`,
    },
    {
      id: "17",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Overpayment refund request",
      date: `06-24-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am writing to request a refund for an overpayment on my account. There are duplicate charges for the same service.
  
  Please review the transactions and process a refund for the extra charge. The details are attached for your review.
  
  Thank you for your assistance.
  
  Best regards,
  Thomas Harris`,
    },
    {
      id: "18",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Duplicate charge on invoice",
      date: `06-23-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I found a duplicate charge on my recent invoice. This error resulted in an overpayment on my account.
  
  Please investigate and refund the duplicate amount. The transaction details are provided for your reference.
  
  Thank you for your prompt action.
  
  Best,
  Matthew Clark`,
    },
    {
      id: "19",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Double payment error",
      date: `06-22-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  There seems to be a double payment error on my account. My account was charged twice for the same transaction in April.
  
  Please review this matter and issue a refund for the duplicate charge. The transaction details are attached.
  
  Thank you for your attention to this matter.
  
  Sincerely,
  Daniel Mitchell`,
    },
    {
      id: "20",
      uid: "kpopschool",
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      tag: "refund/payment",
      title: "Incorrect double charge",
      date: `06-21-2023`,
      state: "waiting for",
      details: `Dear Kpopschool,
  I am contacting you regarding an incorrect double charge on my account. I have been billed twice for the same service in May.
  
  Can you please look into this and process a refund for the extra charge? The transaction details are enclosed for your review.
  
  Thank you for your prompt attention.
  
  Best regards,
  Ethan Young`,
    },
  ];
  for (const dummyInquiry of dummyInquiries) {
    await db.collection("INQUIRY").doc(dummyInquiry.id).set(dummyInquiry);
  }
}

async function addDummyUser() {
  const dummyUsers = [
    {
      id: "NpFi97KtnuYtIdp7AX0dSA0rCUB3",
      createdAt: new Date("2024-06-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/dora.jpeg?alt=media&token=3a550f39-db28-4d65-ba17-c37b72a97280",
      name: "dora",
      firstName: "",
      email: "dora@gmail.com",
      gender: "male",
    },
    {
      id: "iOuiykxaR2XyGSqy3PH1t3tSuzI3",
      createdAt: new Date("2024-06-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/jina.jpeg?alt=media&token=72addf9e-0a13-4350-8c1a-f42c2ec6fe74",
      name: "j222na",
      firstName: "",
      email: "jina@gmail.com",
      gender: "female",
    },
    {
      id: "WoGe9wlqjFNYYBPw7I5WZGx7Ofm2",
      createdAt: new Date("2024-06-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/mina.jpeg?alt=media&token=6d88af86-5eda-480a-8800-a45b9c2a2118",
      name: "mina",
      firstName: "",
      email: "mi_na@gmail.com",
      gender: "female",
    },
    {
      id: "Asdn6GnVWLgSYfjO2MGn0CK2lEF2",
      createdAt: new Date("2024-06-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/luccy.jpeg?alt=media&token=67059584-ced5-49cb-a272-ceabf02f8eff",
      name: "lu_ccy",
      firstName: "",
      email: "luccy@gmail.com",
      gender: "female",
    },
    {
      id: "zbLuCDf1OxRZTd8nKdO90J2LGd32",
      createdAt: new Date("2024-05-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/user1.png?alt=media&token=b9e86688-f4b3-425e-9440-2e129229b949",
      name: "donatella",
      firstName: "",
      email: "nuTelllla@gmail.com",
      gender: "female",
    },
    {
      id: "39XYlrd170gcru4DMoUjvErlHj02",
      createdAt: new Date("2024-04-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile3.png?alt=media&token=2d874079-37e9-472f-97cb-520dba7d9276",
      name: "Hyemi",
      firstName: "Park",
      email: "hmp3456@naver.com",
      gender: "female",
    },
    {
      id: "ARsT5Xayo7VBb3sZqHde9snKm9s1",
      createdAt: new Date("2024-04-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile2.png?alt=media&token=7ef93bbb-024c-4c43-a383-a9c187840c3e",
      name: "Jessie",
      firstName: "",
      email: "dolphine@naver.com",
      gender: "female",
    },
    {
      id: "5OTFfnNrricdMhHtpNtDr5TmXo03",
      createdAt: new Date("2024-04-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/fiatto.jpeg?alt=media&token=e328a8f4-6be0-4ea0-ba13-d01946f111f1",
      name: "fiatto",
      firstName: "",
      email: "aktdlTek@gmail.com",
      gender: "male",
    },
    {
      id: "D8pthMpqPZeHldcU8dCSOWOPsc73",
      createdAt: new Date("2024-04-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile2.png?alt=media&token=7ef93bbb-024c-4c43-a383-a9c187840c3e",
      name: "swaggger",
      firstName: "",
      email: "aktdlTek@gmail.com",
      gender: "female",
    },
    {
      id: "D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      createdAt: new Date("2024-03-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile4.png?alt=media&token=f72d4aab-81cf-4821-8869-bfdc4af93863",
      name: "ZEN",
      firstName: "",
      email: "zeniset@gmail.com",
      gender: "female",
    },
    {
      id: "tNN4Fgzlb7gRWAExM4Vx3tt4Ed83",
      createdAt: new Date("2024-02-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile4.png?alt=media&token=f72d4aab-81cf-4821-8869-bfdc4af93863",
      name: "JAMEY",
      firstName: "",
      email: "dumiyam@gmail.com",
      gender: "female",
    },
    {
      id: "JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      createdAt: new Date("2024-01-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile1.png?alt=media&token=fd5abbc8-38ae-4067-a5e3-0bc136b1755c",
      name: "Lee",
      firstName: "Hwan Ho",
      email: "poqw1234@naver.com",
      gender: "male",
    },
    {
      id: "pnhDMRiYy0RKzb9rz8PIM449nBE2",
      createdAt: new Date("2024-01-07"),
      isTeacher: true,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile5.png?alt=media&token=f34348e9-7c98-40da-840e-95320007fcad",
      name: "ROSE",
      firstName: "",
      email: "riq9582@naver.com",
      gender: "female",
    },
    {
      id: "iUZqgYHuywh4mgftrewUhHX6a0H3",
      createdAt: new Date("2024-01-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile5.png?alt=media&token=f34348e9-7c98-40da-840e-95320007fcad",
      name: "Jane",
      firstName: "Doe",
      email: "dumidumidumdum@gmail.com",
      gender: "female",
    },
  ];

  for (const dummyUser of dummyUsers) {
    await db.collection("USERS").doc(dummyUser.id).set(dummyUser);
  }
}

async function addDummyReview() {
  const dummyReviews = [
    {
      id: "dummyReview1",
      createdAt: new Date("2024-04-07"),
      teacherId: "JudyymsDt9Y1wUS5gdwiYA2vvuP2", // lee hwan ho
      userId: "5OTFfnNrricdMhHtpNtDr5TmXo03", // fiatto
      lessonId: "f8byokTqzpPcCAhXPoOR", // vocal advanced
      rating: 5,
      comment:
        "The teacher was very kind and taught well. Vibration, which wasn't working well, was successful! I'm writing any reviews. They're all dummy texts. I hope they're at least 150 characters long.",
    },
    {
      id: "dummyReview2",
      createdAt: new Date("2024-04-06"),
      teacherId: "ARsT5Xayo7VBb3sZqHde9snKm9s1", // jessie
      userId: "Asdn6GnVWLgSYfjO2MGn0CK2lEF2", // lu_ccy
      lessonId: "9g5ofRWDP319qyaWXJtp", // vocal basic
      rating: 4,
      comment:
        "I'm writing any reviews. They're all dummy texts. I hope they're at least 150 characters long. The teacher was very kind and taught well. Vibration, which wasn't workaing well, was successful! I'm using the same words to block it. Does that make sense.",
    },
    {
      id: "dummyReview3",
      createdAt: new Date("2024-04-05"),
      teacherId: "39XYlrd170gcru4DMoUjvErlHj02", // Hyemi
      userId: "WoGe9wlqjFNYYBPw7I5WZGx7Ofm2", // mina
      lessonId: "fxkBxqg1rr5wyuLCN02k", // dance advanced
      rating: 4,
      comment:
        "I'm writing any reviews. They're all dummy texts. I hope they're at least 150 characters long. The teacher was very kind and taught well. Vibration, which wasn't workaing well, was successful! I'm using the same words to block it. Does that make sense.",
    },
    {
      id: "dummyReview4",
      createdAt: new Date("2024-04-04"),
      teacherId: "D3MGR5mp7pPslFPzvC94ZSJdC1w2", // ZEN
      userId: "iOuiykxaR2XyGSqy3PH1t3tSuzI3", // j222na
      lessonId: "zenTYk73llpKtujPizpL", // dance professional
      rating: 5,
      comment:
        "The teacher was very kind and taught well. Vibration, which wasn't working well, was successful! I'm writing any reviews. They're all dummy texts. I hope they're at least 150 characters long.",
    },
    {
      id: "dummyReview5",
      createdAt: new Date("2024-04-03"),
      teacherId: "pnhDMRiYy0RKzb9rz8PIM449nBE2", // ROSE
      userId: "NpFi97KtnuYtIdp7AX0dSA0rCUB3", // dora
      lessonId: "IAsgKYQo27yljfJH8knV", // dance beginner
      rating: 5,
      comment:
        "The teacher was very kind and taught well. Vibration, which wasn't working well, was successful! I'm writing any reviews. They're all dummy texts. I hope they're at least 150 characters long.",
    },
  ];

  for (const dummyReview of dummyReviews) {
    await db.collection("REVIEW").doc(dummyReview.id).set(dummyReview);
  }
}

async function addDummyHome() {
  const dummyDatas = [
    {
      id: "main",
      banner: [
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/banner1.png?alt=media&token=d733e8ca-b3e1-4d02-8040-80790dfb5583",
        "",
      ],
      description: `We will help you turn your dream of becoming a K-pop star into reality! Shine on stage like a K-pop star through
classes taught by original vocal and dance trainers who have nurtured your favorite K-pop stars. K-pop School offers
the chance to acquire the skills and charms of internationally acclaimed K-pop artists. Real-time video classes and
VOD content make learning easy and fun anytime, anywhere. Start your K-pop journey right now.`,
      strLink: "Lessons",
      promotion_link: "",
      promotion:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/promt.png?alt=media&token=253b0cb2-9236-4b91-8598-a9519688b987",
      withus_link: "",
      withus:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/whylearn.png?alt=media&token=e8c38182-6611-44a3-92fa-06df4876d84f",
    },
    {
      id: "matching",
      title1: "Vocal Trainer",
      trainer1: {
        name: "Jessie",
        description: `- SM, iNetwork entertainmen vocal trainer
- Vocal trainer for 2Eyes, Red Velvet, MOMOLAND, Lee Hae Yi
- Actor vocal trainer (Kim So Jung, Kim Yoo Jung, Lee Yoo Bi, Lee Soo Kyung, etc.)
- Various broadcast programs (Producer 101, King of Masked, K-POP star, etc.)`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile2.png?alt=media&token=7ef93bbb-024c-4c43-a383-a9c187840c3e",
        strLink: "/teachers/ARsT5Xayo7VBb3sZqHde9snKm9s1",
      },
      trainer2: {
        name: "Lee Hwan Ho",
        description: `- SM entertainment vocal trainer
- Selling multiple albums and participating in chorus sessions
- Whee-sung, Ali, URBAN ZAKAPA, DAY6, N.Flying, etc. Vocal Trainer`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile1.png?alt=media&token=fd5abbc8-38ae-4067-a5e3-0bc136b1755c",
        strLink: "/teachers/JudyymsDt9Y1wUS5gdwiYA2vvuP2",
      },
      title2: "Dance Trainer",
      trainer3: {
        name: "Hyemi Park",
        description: `SM entertainment / Nega network Entertainment / Maru Entertainment Choreography Trainer`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile3.png?alt=media&token=2d874079-37e9-472f-97cb-520dba7d9276",
        strLink: "/teachers/39XYlrd170gcru4DMoUjvErlHj02",
      },
      trainer4: {
        name: "ZEN",
        description: `- Professor of K-POP at Kangdong University and HOWON University
- Concert dancer / Training`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile4.png?alt=media&token=f72d4aab-81cf-4821-8869-bfdc4af93863",
        strLink: "/teachers/D3MGR5mp7pPslFPzvC94ZSJdC1w2",
      },
      trainer5: {
        name: "ROSE",
        description: `- SM Entertainment Choreography Trainer
- ADIDAS stella event performance director`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile5.png?alt=media&token=f34348e9-7c98-40da-840e-95320007fcad",
        strLink: "/teachers/pnhDMRiYy0RKzb9rz8PIM449nBE2",
      },
    },
    {
      id: "lessons",
      title: "Lessons",
      vocal: {
        description: `Unleash the magic of K-pop with your voice! K-pop School's vocal course allows you to take your vocal skills to the next level through professional vocal training.

You can practice the latest K-pop hits with the same vocal trainer who taught and coached the K-pop stars you love. Learn everything it takes to become a K-pop star, including pronunciation, vocalization, and emotional expression. Prepare your own stage right now!`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/vocal_lesson.png?alt=media&token=50aae125-8900-44b7-95b2-9b80a8901c73",
        strLink: "/curriculum/Vocal",
      },
      dance: {
        description: `Discover your own dance style at K-pop school! You can learn amazing choreography and perfect it like a K-pop idol through professional dance classes.

Prepare to stand on the stage you have always longed for with a trainer who has taught K-pop stars. Dynamic dance routines, stylish choreography, and energetic performances will help you become the true star of the stage. Are you ready to dive into the world of K-pop?`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/dance_lesson.png?alt=media&token=18769826-64d5-49c6-a8c2-29ddc4c9c91f",
        strLink: "/curriculum/Dance",
      },
    },
    {
      id: "course",
      title: "Our Courses",
      beginner: {
        description: `Step into the spotlight with K-Pop School. Get ready to move and groove. It's your time to shine. Join now!
#KPopVibes
#DanceDreams`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/beginner.png?alt=media&token=5af6bce7-5a7b-44cd-974e-0912ba6db853",
        strLink: "",
      },
      intermediate: {
        description: `Ready to level up your K-pop game? Our Intermediate Course is the ticket for you to master killer melodies and harmonies like a pro.
#KPopStar #NextLevel`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/intermediate.png?alt=media&token=b3fc9b24-9f34-48ee-9620-c9b48cca10a6",
        strLink: "",
      },
      advanced: {
        description: `Take the center stage with our Advanced Vocal Course. Advanced Dance Course is your battlefield. It's not just a class; it's your pathway to stardom.
#BeTheIcon #KPopMastery`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/advanced.png?alt=media&token=9a69bd37-c87f-49b6-a2b4-148980c33ea5",
        strLink: "",
      },
      professional: {
        description: `Have you dreamt of being a K-pop prodigy? Our Professional Course is the last step in your journey to achieving K-pop supremacy.
#ProDebut #KPopPro`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/professional.png?alt=media&token=a00cac3c-f666-42eb-9884-b5ff92df2b63",
        strLink: "",
      },
    },
    {
      id: "lessonType",
      one: {
        description: `Unlock your full K-pop potential by taking private lessons at K-Pop School. Elevate your artistry, boost your confidence, and get ready to take the K-pop world by storm!`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/one.png?alt=media&token=dd81aa7c-1494-41e3-be71-96a205f2b25f",
        strLink: "",
      },
      six: {
        description: `Step into the vibrant ensemble of
K-Pop School's group lessons, where collective energy combines with individual attention.`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/six.png?alt=media&token=f4beb3d8-8eb8-4f7d-aa6b-3bd1d7bf2302",
        strLink: "",
      },
      vod: {
        description: `Our industry experts have meticulously crafted video sessions, ensuring that you can learn the moves and grooves at your own pace.`,
        image:
          "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/vod.png?alt=media&token=25971ecc-9358-4ce9-8f3d-553af8b59848",
        strLink: "",
      },
    },
    {
      id: "vocal_course",
      one: {
        section1: {
          title: "Beginner Course",
          month: 3,
          session: 12,
          description: `Unlock Your True Vocal Potential with Personalized 1:1 Lessons

Discover the power of your unique voice through our tailored 1:1 vocal lessons. Our experienced instructors, trained in the latest K-pop techniques, will guide you to develop proper breathing, pitch control, and stage presence. Whether you're a beginner or looking to refine your skills, our personalized approach ensures rapid progress and builds confidence. Join us to elevate your singing to professional levels and prepare for your moment in the spotlight.`,
        },
        section2: {
          title: "Intermediate Course",
          month: 3,
          session: 12,
          description: `- Intermediate Vocal Technique: Advanced Breathing and Vocal Techniques
- Compound Pronunciation Practice: Deepening Korean Pronunciation
- Practice K-pop songs of various genres
- Strengthening stage expression
- In-depth practice of rhythm and beat
- Deepening empathy and expression
- Diversifying vocal tones
- In-depth live performance
- Solo song practice and feedback
- Group Project: Collaboration
- Music Video Production Basics
- Music video production and evaluation`,
        },
        section3: {
          title: "Advanced Course",
          month: 3,
          session: 12,
          description: `- Advanced Vocal Techniques: Breathing and Vocalization Specialization
- Advanced pronunciation practice and interpretation
- Complex genre K-pop song practice
- Stage charisma and expressiveness
- Complex rhythm and beat practice
- Storytelling and conveying emotions
- Developing a unique vocal style
- professional live performance
- Writing your own songs and providing feedback
- Creative Project: Create your own song
- Advanced music video production
- Music video presentation and review`,
        },
        section4: {
          title: "Professional Course",
          month: 3,
          session: 12,
          description: `- Professional vocal technique: personalized vocalization
- Professional-level pronunciation and expression
- Various genre complex K-pop songs
- Professional stage performance and staging
- Professional Rhythm and Beat Master
- In-depth storytelling and conveying emotions
- Vocal identity as an individual artist
- large-scale live performance
- Professionally composed songs and album production
- Artist Branding and Marketing Strategy
- Professional music video production
- Final performance and professional debut audio`,
        },
      },
      six: {
        section1: {
          title: "Beginner Course",
          month: 3,
          session: 12,
          description: `Unlock Your True Vocal Potential with Personalized 1:1 Lessons

Discover the power of your unique voice through our tailored 1:1 vocal lessons. Our experienced instructors, trained in the latest K-pop techniques, will guide you to develop proper breathing, pitch control, and stage presence. Whether you're a beginner or looking to refine your skills, our personalized approach ensures rapid progress and builds confidence. Join us to elevate your singing to professional levels and prepare for your moment in the spotlight.`,
        },
        section2: {
          title: "Intermediate Course",
          month: 3,
          session: 12,
          description: `- Intermediate Vocal Technique: Advanced Breathing and Vocal Techniques
- Compound Pronunciation Practice: Deepening Korean Pronunciation
- Practice K-pop songs of various genres
- Strengthening stage expression
- In-depth practice of rhythm and beat
- Deepening empathy and expression
- Diversifying vocal tones
- In-depth live performance
- Solo song practice and feedback
- Group Project: Collaboration
- Music Video Production Basics
- Music video production and evaluation`,
        },
        section3: {
          title: "Advanced Course",
          month: 3,
          session: 12,
          description: `- Advanced Vocal Techniques: Breathing and Vocalization Specialization
- Advanced pronunciation practice and interpretation
- Complex genre K-pop song practice
- Stage charisma and expressiveness
- Complex rhythm and beat practice
- Storytelling and conveying emotions
- Developing a unique vocal style
- professional live performance
- Writing your own songs and providing feedback
- Creative Project: Create your own song
- Advanced music video production
- Music video presentation and review`,
        },
        section4: {
          title: "Professional Course",
          month: 3,
          session: 12,
          description: `- Professional vocal technique: personalized vocalization
- Professional-level pronunciation and expression
- Various genre complex K-pop songs
- Professional stage performance and staging
- Professional Rhythm and Beat Master
- In-depth storytelling and conveying emotions
- Vocal identity as an individual artist
- large-scale live performance
- Professionally composed songs and album production
- Artist Branding and Marketing Strategy
- Professional music video production
- Final performance and professional debut audio`,
        },
      },
      vod: {
        section1: {
          title: "Beginner Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section2: {
          title: "Intermediate Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section3: {
          title: "Advanced Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section4: {
          title: "Professional Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
      },
    },
    {
      id: "dance_course",
      one: {
        section1: {
          title: "Beginner Course",
          month: 3,
          session: 12,
          description: `Unlock Your True Vocal Potential with Personalized 1:1 Lessons

Discover the power of your unique voice through our tailored 1:1 vocal lessons. Our experienced instructors, trained in the latest K-pop techniques, will guide you to develop proper breathing, pitch control, and stage presence. Whether you're a beginner or looking to refine your skills, our personalized approach ensures rapid progress and builds confidence. Join us to elevate your singing to professional levels and prepare for your moment in the spotlight.`,
        },
        section2: {
          title: "Intermediate Course",
          month: 3,
          session: 12,
          description: `- Intermediate Vocal Technique: Advanced Breathing and Vocal Techniques
- Compound Pronunciation Practice: Deepening Korean Pronunciation
- Practice K-pop songs of various genres
- Strengthening stage expression
- In-depth practice of rhythm and beat
- Deepening empathy and expression
- Diversifying vocal tones
- In-depth live performance
- Solo song practice and feedback
- Group Project: Collaboration
- Music Video Production Basics
- Music video production and evaluation`,
        },
        section3: {
          title: "Advanced Course",
          month: 3,
          session: 12,
          description: `- Advanced Vocal Techniques: Breathing and Vocalization Specialization
- Advanced pronunciation practice and interpretation
- Complex genre K-pop song practice
- Stage charisma and expressiveness
- Complex rhythm and beat practice
- Storytelling and conveying emotions
- Developing a unique vocal style
- professional live performance
- Writing your own songs and providing feedback
- Creative Project: Create your own song
- Advanced music video production
- Music video presentation and review`,
        },
        section4: {
          title: "Professional Course",
          month: 3,
          session: 12,
          description: `- Professional vocal technique: personalized vocalization
- Professional-level pronunciation and expression
- Various genre complex K-pop songs
- Professional stage performance and staging
- Professional Rhythm and Beat Master
- In-depth storytelling and conveying emotions
- Vocal identity as an individual artist
- large-scale live performance
- Professionally composed songs and album production
- Artist Branding and Marketing Strategy
- Professional music video production
- Final performance and professional debut audio`,
        },
      },
      six: {
        section1: {
          title: "Beginner Course",
          month: 3,
          session: 12,
          description: `Unlock Your True Vocal Potential with Personalized 1:1 Lessons

Discover the power of your unique voice through our tailored 1:1 vocal lessons. Our experienced instructors, trained in the latest K-pop techniques, will guide you to develop proper breathing, pitch control, and stage presence. Whether you're a beginner or looking to refine your skills, our personalized approach ensures rapid progress and builds confidence. Join us to elevate your singing to professional levels and prepare for your moment in the spotlight.`,
        },
        section2: {
          title: "Intermediate Course",
          month: 3,
          session: 12,
          description: `- Intermediate Vocal Technique: Advanced Breathing and Vocal Techniques
- Compound Pronunciation Practice: Deepening Korean Pronunciation
- Practice K-pop songs of various genres
- Strengthening stage expression
- In-depth practice of rhythm and beat
- Deepening empathy and expression
- Diversifying vocal tones
- In-depth live performance
- Solo song practice and feedback
- Group Project: Collaboration
- Music Video Production Basics
- Music video production and evaluation`,
        },
        section3: {
          title: "Advanced Course",
          month: 3,
          session: 12,
          description: `- Advanced Vocal Techniques: Breathing and Vocalization Specialization
- Advanced pronunciation practice and interpretation
- Complex genre K-pop song practice
- Stage charisma and expressiveness
- Complex rhythm and beat practice
- Storytelling and conveying emotions
- Developing a unique vocal style
- professional live performance
- Writing your own songs and providing feedback
- Creative Project: Create your own song
- Advanced music video production
- Music video presentation and review`,
        },
        section4: {
          title: "Professional Course",
          month: 3,
          session: 12,
          description: `- Professional vocal technique: personalized vocalization
- Professional-level pronunciation and expression
- Various genre complex K-pop songs
- Professional stage performance and staging
- Professional Rhythm and Beat Master
- In-depth storytelling and conveying emotions
- Vocal identity as an individual artist
- large-scale live performance
- Professionally composed songs and album production
- Artist Branding and Marketing Strategy
- Professional music video production
- Final performance and professional debut audio`,
        },
      },
      vod: {
        section1: {
          title: "Beginner Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section2: {
          title: "Intermediate Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section3: {
          title: "Advanced Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
        section4: {
          title: "Professional Course",
          month: 0,
          session: 0,
          description: `We are preparing for class`,
        },
      },
    },
    {
      id: "policy",
      sections: [
        {
          index: 0,
          title: "Privacy Policy",
          description: `At kpop School, we are committed to protecting the privacy and security of our users' personal information. This Privacy Policy describes how we collect, use, and disclose personal information when you use our online lesson service. By using our service, you consent to the practices described in this policy.
Information We Collect 1.1 Personal Information: When you register for our service, we may collect personal information such as your name, email address, phone number, and payment information.
1.2 Usage Information: We may collect information about how you use our service, such as the courses you enroll in, the lessons you complete, and the interactions you have with our platform.
1.3 Cookies and Similar Technologies: We may use cookies and similar technologies to collect information about your browsing behavior and to personalize your experience on our platform.
How We Use Your Information 2.1 To Provide and Improve Our Service: We use your personal information to provide and improve our online lesson service, including processing payments, delivering courses, and responding to your inquiries.
2.2 To Communicate with You: We may use your contact information to send you updates, newsletters, marketing communications, and other information related to our service.
2.3 To Analyze and Personalize: We may use your usage information and other data to analyze trends, personalize your experience, and improve our service.
How We Share Your Information 3.1 With Service Providers: We may share your personal information with third-party service providers who assist us in operating our platform, processing payments, or providing other services.
3.2 With Business Partners: We may share your personal information with our business partners for marketing or other purposes, but only with your consent.
3.3 For Legal Reasons: We may disclose your personal information if required to do so by law or in response to valid requests by public authorities.
Your Choices and Rights 4.1 Access and Update: You may access and update your personal information by logging into your account on our platform.
4.2 Opt-out: You may opt-out of receiving marketing communications from us by following the unsubscribe instructions provided in those communications.
4.3 California Privacy Rights: If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA), such as the right to access, delete, or opt-out of the sale of your personal information.
Data Security We implement reasonable security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
Changes to This Policy We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our platform.
Contact Us If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at privacy@kpopschool.com.
This Privacy Policy is effective as of [Insert Date].`,
        },
        {
          index: 1,
          title: "Terms & Conditions",
          description: `Article 1 (Purpose)
The purpose of this agreement is to prescribe the rights, obligations, and responsibilities between the company and its members in relation to the use of the online lesson service (hereinafter referred to as the "Service") provided by the kpop School (hereinafter referred to as the "Company").

Article 2 (Definition of Terms)
The terms used in these Terms and Conditions are defined as follows.
1. The term "member" means a person who has entered into a usage contract with the company to use the services provided by the company.
2. "Content" means any information, material, image, video, voice, etc. contained within the services provided by the Company.
3. The term "instructor" means a person who enters into a contract with a company and provides online lessons within the service.

Article 3 (Effect and Changes of Terms and Conditions)
1. These terms and conditions will be disclosed to all members who wish to use the service, and will take effect as members use the service.
2. If necessary, the company may change the terms and conditions to the extent that they do not violate relevant laws and regulations, and the changed terms and conditions will be notified to the members by means of notification within the service or e-mail.
3. Members have the right to disagree with the changed terms and conditions, and if they do not agree to the changed terms and conditions, they may suspend the use of the service and withdraw from the membership.

Article 4 (Conclusion of Service Use Contract)
1. The service use contract is concluded when the member signs up for membership according to the procedure set by the company and the company approves it.
2. The company may refuse to accept membership in the following cases.
   - Where the applicant for membership has previously lost his/her membership under these terms and conditions
   - Where he/she applies for membership by not being his/her real name or stealing the information of another person
   - Where necessary information is falsely entered when applying for membership
   - Other application requirements set by the company have not been met

Article 5 (Management and Protection of Member Information)
1. Members must keep the information written at the time of membership accurate and up-to-date, and must update immediately when the information is changed.
2. The company thoroughly protects the member's personal information in accordance with a separate personal information processing policy and does not provide it to a third party without the member's consent.
3. Members shall not share or transfer their ID and password to others, and they shall be responsible for any consequences arising from the breach.

Article 6 (Provision and modification of services)
1. The company provides members with the following services.
   - Taking online lessons
   - Q&A and feedback with instructor
   - Course progress and history management
   - Other services provided by the company through additional development or partnership
2. The company may change or terminate the contents of the service, in which case the company will notify the members in advance.

Article 7 (Service usage fee)
1. Fees for use of the service shall be determined separately by the Company, and the Company shall announce the fee within the website or service operated by the Company.
2. Members must pay the service usage fee within the specified date by the company in the method specified by the company.
3. The company may change the usage fee, and the changed fee will take effect from the date specified by the company.

Article 8 (Refund and cancellation)
1. Members may apply for a refund for the service usage fee according to the refund policy set separately by the company.
2. The company will proceed with the refund within a certain period of time from the date of the refund application if the member's refund application is deemed to be due to a justifiable reason.
3. Members may cancel their application for the course until the scheduled course begins, in which case the company will handle it in accordance with a separate cancellation and refund policy.

Article 9 (Obligation of Members)
Members shall not engage in any of the following acts.
1. An act that infringes on the intellectual property rights of the company or a third party
2. Any act that defames the company or a third party or infringes on its privacy
3. Unauthorized reproduction, distribution, and modification of content within a service
4. an act that interferes with the normal operation of the service
5. Any act that violates other relevant laws or rules of use established by the company

Article 10 (Exemption Provisions)
1. The company does not guarantee the accuracy, completeness, timeliness, etc. of the content in the service and is not liable for any damages caused to members due to errors or inaccuracies in the content.
2. The Company shall not be liable for any interaction between Members or between Members and third parties, nor shall it be liable for any damages caused by this.
3. The Company shall not be liable for any damages caused by the information or materials obtained by the Member using the Service.

Article 11 (Regulations other than the Terms and Conditions)
Matters not specified in these Terms and Conditions are subject to relevant laws and regulations.

Article 12 (Dispute Resolution)
1. In the event of a dispute between the company and its members regarding the use of the service, both parties shall work to resolve the dispute through mutual consultation.
2. If the dispute is not resolved through consultation, both parties may file a lawsuit with the competent court.

Supplementary Provisions
These terms and conditions will take effect on January 1, 2023.

These terms and conditions have been prepared by referring to the terms and conditions of use of U.S. laws and similar services. The company collects and uses the personal information of members to provide services, and discloses related matters through the personal information processing policy. In addition, we intend to minimize disputes over the use of services by clearly defining the copyright and intellectual property rights protection of content, refund and cancellation policies, and members' obligations and responsibilities.`,
        },
      ],
    },
  ];

  for (const dummyData of dummyDatas) {
    await db.collection("HOME").doc(dummyData.id).set(dummyData);
  }
}

module.exports = { deleteAllCollections, addDummyData, uploadImage };
