const axios = require("axios")
const puppeteer = require('puppeteer')
const cron = require('node-cron')

const API_KEY = "voEvDZUIK2_mwaU6ZT0gW9rRuVPDuNEf"
const substack = "https://jessicadenouter.substack.com/subscribe"

async function getRevueSubscripers() {
    const checkLastTime = Date.now() - 900000
    axios.get("https://www.getrevue.co/api/v2/subscribers", { headers: {
        'Authorization': `Token ${API_KEY}`
    }})
    .then((res) => {
        console.log(res.data)
        for (const user of res.data) {
            if (Date.now(user.last_changed) > checkLastTime) {
                addReveuSubscriberToSubstack(user)
            }
        }
    })
    .catch((e) => {console.log(e)})
}

async function addReveuSubscriberToSubstack (user) {
    const browser = await puppeteer.launch({headless:true})
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto(substack, { waitUntil: 'domcontentloaded' })
    await page.setViewport({ width: 1280, height: 648 })
    await page.waitForSelector('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input')
    await page.click('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input')
    await page.type('.full-email-form > .vertically-centred > .form > .sideBySideWrap > input', user.email)
    await page.waitForSelector('.full-email-form > .vertically-centred > .form > .sideBySideWrap > .button')
    await page.click('.full-email-form > .vertically-centred > .form > .sideBySideWrap > .button')
    await browser.close()
}


// cron.schedule('* * * * *', () => {
//     getRevueSubscripers()
//   });

  getRevueSubscripers()
