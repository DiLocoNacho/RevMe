var admin = require("firebase-admin");
module.exports = {

    requiresUserToken: async function(req, res, next) {

        try {
            const { idtoken } = req.headers;
            const uid = await module.exports.getUidFromToken(idtoken);
            return next();
        } catch (err) {
            return res.json({ message: 'Incorrect token' })
        }
    },

    async getUidFromToken(idToken) {
        try {
            const { uid } = await admin.auth().verifyIdToken(idToken);
            if (uid) return uid;
            return '';
        } catch (err) {
            throw Error('User token has expired. Please refresh this page.');
        }
    },

}