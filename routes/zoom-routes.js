const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const {
  getZoomAccessToken,
  coerceRequestBody,
  propValidations,
  schemaValidations,
} = require("../controllers/zoomController");
const { validateRequest } = require("../public/javascripts/validations");
const KJUR = require("jsrsasign"); // "jsrsasign": "^11.0.2"

router.post("/create-meeting", async (req, res) => {
  try {
    let accessToken = await getZoomAccessToken();
    console.log(accessToken);
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "New Meeting",
        type: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating meeting:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error creating meeting.");
  }
});

router.post("/generate-signature", (req, res) => {
  const requestBody = coerceRequestBody(req.body);
  const validationErrors = validateRequest(
    requestBody,
    propValidations,
    schemaValidations
  );

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const { meetingNumber, role, expirationSeconds } = requestBody;

  const iat = Math.floor(Date.now() / 1000);
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MEETING_SDK_SECRET
  );

  console.log("sdkJWT : ", sdkJWT);

  return res.json({ signature: sdkJWT });
});

module.exports = router;
