const { Router } = require("express");
const router = Router();
const sanitize = require("mongo-sanitize");

const encryption = require("../../utils/encryption.js");
const auth = require('../../utils/auth');

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

router.put('/profile', auth.requiresUserToken, async(req, res) => {
  try{
      // const profile = sanitize(req.body);
      const { idtoken } = req.headers;
      const uid = await auth.getUidFromToken(idtoken);
      
      let updateProfile = {}
      if(profile?.displayName) updateProfile.displayName = profile.displayName
      if(profile?.email) updateProfile.email = profile.email

      await User.updateOne({uid}, {$set: { ...profile }})
      res.status(200).send('Profile updated');
  }catch(err){
      res.status(500).send()
  }
  
})

module.exports = router;
