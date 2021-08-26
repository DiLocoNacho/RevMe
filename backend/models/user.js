const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  createdDate: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  platform: {
    type: String,
    required: true,
  },
  substackURL: {
    type: String,
    required: false
  },
  apiKeyRevue: {
    encryptedApiKey: {
      type: String,
      required: false
    },
    iv: {
      type: String,
      required: false
    }
  },
  apiKeySec: {
    type: String,
    required: false
  },
  lastCheck: {
      type: Number,
      required: true
  }
});

const myDB = mongoose.connection.useDb("RevMe");
const User = myDB.model("User", UserSchema);

module.exports = User;
