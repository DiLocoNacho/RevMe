require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')

const syncSubscribers = require('./utils/syncSubscribers.js')
const encryption = require('./utils/encryption.js')

const Users = require('./models/user')

const app = express()

// MongoDB & Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true})
.catch(err => {
    console.log(err);
})
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)


// // Firebase
// var admin = require("firebase-admin");
// var serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: process.env.FIREBASE_AUTH_DOMAIN
// });

// Setup uses
app.use(cors())
app.use(express.json())

// Import API Routes
app.use(`/users`, require('./routes/users'));


// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })

}

// Run cronjob to sync subscribers
cron.schedule('* * * * *', () => {
    syncSubscribers.sync()
});
