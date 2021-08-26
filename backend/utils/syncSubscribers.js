const axios = require('axios');
const puppeteer = require('puppeteer');

const encryption = require('./encryption.js')

const UserList = require("../models/user.js");


//Get all users
async function getAllUsers() {
  try {
    const users = await UserList.find({});
    return users;
  } catch (e) {
    console.log(e);
  }
}

//for every user, check if any subscriber is added since last check
async function checkAllUsersForNewSubscribers(users) {
  try {
    for (const user of users) {
      const apiKey = await encryption.decryptKey(user.apiKeyRevue)
      axios.get("https://www.getrevue.co/api/v2/subscribers", { headers: {
        'Authorization': `Token ${apiKey}`
    }})
    .then(async (res) => {
      for (const sub of res.data) {
        const lastChanged = Date.parse(sub.last_changed)
        const lastChecked = user.lastCheck
        if (lastChanged - lastChecked >= 0) {
          addSubscriberToOtherService(sub.email, user.substackURL)
        }
        const id = user._id
        const now = Date.now()
        // Update LastCheck
        await UserList.findOneAndUpdate({_id: id}, {lastCheck: now})
      }
      
    })
    .catch((e) => {console.log(e)})
    }
    console.log("Run Successfull")
  } catch (e) {
    console.log(e)
  }
}

//If anybody is added, add them to users platform
async function addSubscriberToOtherService(sub, url) {
  const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1280, height: 648 })
    await page.waitForSelector('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input')
    await page.click('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input')
    await page.type('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input', sub)
    await page.waitForSelector('.full-email-form > .vertically-centred > .form > .sideBySideWrap > .button')
    await page.click('.full-email-form > .vertically-centred > .form > .sideBySideWrap > .button')
    await browser.close()
}

module.exports = {
  sync: async () => {
    try {
      const users = await getAllUsers();
      checkAllUsersForNewSubscribers(users)
    } catch (err) {
      console.log(err);
    }
  },
};
