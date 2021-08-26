const { Router } = require("express");
const router = Router();
const sanitize = require("mongo-sanitize");

const encryption = require("../../utils/encryption.js");

const User = require("../../models/User");
// const auth = require('../../utils/auth');

router.post("/create", async (req, res) => {
  try {
    const { email, platform, apiKeyRevue, substackURL, lastCheck } = sanitize(
      req.body
    );
    const encryptedApiKey = await encryption.encryptKey(apiKeyRevue);
    new User({
      email,
      platform,
      apiKeyRevue: {
        encryptedApiKey: encryptedApiKey.encryptedData,
        iv: encryptedApiKey.iv,
      },
      substackURL,
      lastCheck,
    })
      .save()
      .then(async (data) => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.json({ success: false });
        throw Error(err.message);
      });
  } catch (err) {
    console.log(err);
    res.json({ success: false, err: err.message });
  }
});

module.exports = router;
