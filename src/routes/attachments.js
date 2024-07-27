const express = require("express");
const AttachmentRoute = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');
const {
    create,
    get,
    getSingle,
    update,
    remove,
} = require("../controller/attachment/index");

const serviceAccount = require('../config/development-382105-firebase-adminsdk-kygs6-9e399f256b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://development-382105.appspot.com',
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });





AttachmentRoute.route("/file/:appId/attachments").post(upload.single('file'), create);
AttachmentRoute.route("/file/:appId/attachments").get(get);
AttachmentRoute.route("/file/:appId/attachments/:id").get(getSingle);
AttachmentRoute.route("/file/:appId/attachments/:id").put(update);
AttachmentRoute.route("/file/:appId/attachments/:id").patch(update);
AttachmentRoute.route("/file/:appId/attachments/:id").delete(remove);

module.exports = AttachmentRoute;