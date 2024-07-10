// 결제 데이터 라우터
const express = require("express");
const Stripe = require("stripe");
const firebase = require("../db");
const firestore = firebase.firestore();

const router = express.Router();

const collectionName = "customers";
const stripe = Stripe(
  "rk_test_51PU2jDGcRvPNh5Hm1VgzH5bXip79oDuQNbzfwgzV7vuidkrHwDFcg5fwf3auGYdVhA0VYQvkPOsvxOQKSORraNNn00Q2BDRBTo"
); // Stripe 비공개 키

router.post("/create-product", async (req, res) => {
  try {
    const { name, description, metadata, price } = req.body;

    // 제품 생성
    const product = await stripe.products.create({
      name,
      description,
      metadata,
    });

    // 가격 생성
    const productPrice = await stripe.prices.create({
      unit_amount: price,
      currency: "usd",
      product: product.id,
    });

    res.json({ product, price: productPrice });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get/:id", async (req, res) => {
  await firestore
    .collection(collectionName)
    .doc(req.params.id)
    .collection("payments")
    .get()
    .then((snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      res.send(results);
    });
});

router.get("/list", async (req, res) => {
  try {
    const usersSnapshot = await firestore.collection(collectionName).get();
    if (usersSnapshot.empty) {
      return res.status(404).send("No users found.");
    }

    const orders = [];

    // 각 사용자의 'payments' 하위 콜렉션을 순회
    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await userDoc.ref.collection("payments").get();
      ordersSnapshot.forEach((doc) => {
        orders.push({ uid: userDoc.id, id: doc.id, ...doc.data() });
      });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get/product/:pid", async (req, res) => {
  try {
    const productSnapshot = await firestore
      .collection("products")
      .doc(req.params.pid)
      .get();
    if (!productSnapshot.exists) {
      return res.status(404).send("Product not found.");
    }

    let curriculumID = productSnapshot.data().metadata.curriculumID;
    console.log(curriculumID);
    const data = await firestore
      .collection("CURRICULUMS")
      .doc(curriculumID)
      .get();

    const tid = data.data().teacherId;

    const teacherSnapshot = await firestore
      .collection("TEACHERS")
      .doc(tid)
      .get();

    res
      .status(200)
      .json({ id: data, ...data.data(), teacher: teacherSnapshot.data() });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
