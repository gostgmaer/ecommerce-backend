const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} = require("http-status-codes");
const { FilterOptions } = require("../../utils/helper");
const Attachments = require("../../models/attchments");
const admin = require('firebase-admin');
const storageBucket= 'gs://development-382105.appspot.com'

const create = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({
                statusCode: 400,
                status: "Internal Server Error",
                message: "No File Uploaded",
            });
        }
        const bucket = admin.storage().bucket();
        const filename = `${Date.now()}_${file.originalname}`;

        // Upload the file to Firebase Storage
        const fileUpload = bucket.file(filename);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on('error', (error) => {
            res.status(500).json({
                statusCode: 500,
                status: "Internal Server Error",
                message: error.message,
            });
        });

        stream.on('finish', async () => {
            // File uploaded successfully
            const fileMetadata = await fileUpload.getMetadata();
       
            // Save information about the file to MongoDB
            const fileInfo = new Attachments({
                filename: filename,
                originalname: file.originalname,
                contentType: file.mimetype,
                url:`https://storage.googleapis.com${storageBucket}/${filename}`, // Replace with your actual bucket URL
            });

            await fileInfo.save();
            res.status(200).json({
                statusCode: 200,
                status: "OK",
                message: "File uploaded to Firebase Storage and saved to MongoDB.",
                result:fileInfo
            });

        });

        stream.end(file.buffer);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: error.message,
        });
    }
};

const get = async (req, res) => {
    const { limit, page, filter, sort } = req.query;

    try {
        const filterquery = FilterOptions(sort, page, limit, filter);

    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: error.message,
        });
    }
};

const getSingle = async (req, res) => {
    try {


    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: error.message,
        });
    }
};
const update = async (req, res) => {


};
const remove = async (req, res) => {

};

const itemsPerBrands = async (req, res) => {

};



module.exports = {
    create,
    get,
    getSingle,
    update,
    remove,
    itemsPerBrands,
};
