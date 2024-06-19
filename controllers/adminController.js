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
    await addDummyCurriculum();
    await addDummyInquiry();
    await addDummyUser();
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
      id: "vPfoGGRJGzKzK7M3R42A",
      uid: "kpopschool",
      createdAt: now,
      tag: "refund/payment",
      title: "Duplicate payment",
      date:
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        now.getFullYear(),
      state: "waiting for",
      details: `Dear Kpopschool,
I am writing to bring to your attention an issue regarding a duplicate payment. It appears that my account has been charged twice for the same transaction.

Could you please investigate this matter and initiate a refund for the duplicate charge at your earliest convenience? I have attached the relevant transaction details for your reference.

Thank you for your prompt attention to this matter.

Best regards,
Jhon Doe`,
    },
    {
      id: "wFgmvGwAMegowItnOCUO",
      uid: "kpopschool",
      createdAt: now,
      tag: "ETC",
      title: "find deleted post",
      date:
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        now.getFullYear(),
      state: "waiting for",
      details: `Dear Kpopschool,

I am writing to request assistance in locating a deleted post from my account. I accidentally deleted a post that is important to me and would like to recover it if possible.

Could you please help me restore the deleted post? I would greatly appreciate any assistance you can provide in retrieving it.

Thank you for your time and help.

Best regards,
Jhon Doe`,
    },
  ];
  for (const dummyInquiry of dummyInquiries) {
    await db.collection("INQUIRY").doc(dummyInquiry.id).set(dummyInquiry);
  }
}

async function addDummyUser() {
  const dummyUsers = [
    {
      id: "zbLuCDf1OxRZTd8nKdO90J2LGd32",
      createdAt: new Date("2024-05-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/user1.png?alt=media&token=b9e86688-f4b3-425e-9440-2e129229b949",
      name: "donatella",
      firstName: "",
      email: "nuTelllla@gmail.com",
      snsType: "instagram",
      snsId: "natellllla",
      location: "Tokyo, Japan",
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
      snsType: "x",
      snsId: "hyemipark_t",
      location: "Seoul, South Korea",
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
      snsType: "instagram",
      snsId: "jecvs2",
      location: "San Francisco, USA",
    },
    {
      id: "5OTFfnNrricdMhHtpNtDr5TmXo03",
      createdAt: new Date("2024-04-07"),
      isTeacher: false,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/motionbit-kpopschool.appspot.com/o/profile2.png?alt=media&token=7ef93bbb-024c-4c43-a383-a9c187840c3e",
      name: "fiatto",
      firstName: "",
      email: "aktdlTek@gmail.com",
      snsType: "instagram",
      snsId: "_attto_",
      location: "New York, USA",
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
      snsType: "x",
      snsId: "boogie_09",
      location: "New York, USA",
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
      snsType: "instagram",
      snsId: "ze2n_20",
      location: "London, UK",
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
      snsType: "x",
      snsId: "jjj*145",
      location: "London, UK",
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
      snsType: "instagram",
      snsId: "music4life_",
      location: "Seoul, South Korea",
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
      snsType: "instagram",
      snsId: "rosy2",
      location: "Osaka, Japan",
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
      snsType: "instagram",
      snsId: "Jane_DOoee",
      location: "California, USA",
    },
  ];

  for (const dummyUser of dummyUsers) {
    await db.collection("USERS").doc(dummyUser.id).set(dummyUser);
  }
}

module.exports = { deleteAllCollections, addDummyData };
