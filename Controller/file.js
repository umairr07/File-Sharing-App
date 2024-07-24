const multer = require("multer")
const { v4: uuidv4 } = require('uuid');
const path = require("path")
const FileModel = require("../Model/file")
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")


dotenv.config()

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: "1212",
    secure: false
})

// console.log(uuidv4() + " .pdf .png .js")
//Where to save the file?
const uploadFolderPath = "Uploads";

//saving into disk
const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, uploadFolderPath)
    },
    filename: (req, file, cb) => {
        const filename = uuidv4() + path.extname(file.originalname);
        cb(null, filename)
    }
})

//how to use multer?
const uploadMulter = multer({
    storage: storage,
    // limits: { fileSize: 1024 * 1024 * 2 } //2mb
}).single("attachment");
//single() for how many files to upload
//for multiple use any() or array()


const uploadFile = async (req, res) => {
    uploadMulter(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: "File size too large"
            })
        }
        const fileData = {
            originalName: req.file.originalname,
            newName: req.file.filename,
            fileSize: req.file.size
        }
        const addedFileInDb = await FileModel.create(fileData)
        res.json({
            success: true,
            message: "File uplaoded Successfully",
            fileId: addedFileInDb._id, //it will use in another api
            fileData: fileData
        })
    })
}

const genrateLink = async (req, res) => {
    try {
        const sharableLink = `/files/download/${req.params.fileId}`
        const fileData = await FileModel.findById(req.params.fileId)
        if (!fileData) {
            res.status(400).json({
                success: false,
                message: "File doesn't exist"
            })
        }
        res.json({
            success: true,
            message: "Link working properly",
            result: sharableLink
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Link failed working properly"
        })
    }
}

const downloadaleLink = async (req, res) => {
    const fileId = req.params.fileId;
    // console.log(fileId)
    const fileData = await FileModel.findById(fileId)
    // console.log(fileData)
    if (!fileData) {
        res.end("Invalid URL")
    }
    const pathFile = `Uploads/${fileData.newName}`
    res.download(pathFile, fileData.originalName)
}

// const sendEmail = async (req, res) => {
//     const body = req.body;
//     const fileId = req.body.fileId;
//     console.log(fileId)
//     const sharableLink = `${process.env.BASE_URL}/files/download/${fileId}`

//     const emailData = {
//         to: req.body.email,
//         from: "do-not-reply@filesharing.com",
//         subject: "Mail is sent to you",
//         html: `
//             <p> An email has been sent to you please click the link to download <a href="${sharableLink}">Click here<a/>
//             </p>
//         `
//     }


//     transporter.sendMail(emailData, (error, info) => {
//         if (error) {
//             console.log(error)
//             return res.json({
//                 success: false,
//                 message: "Unable to send email",
//                 error: error
//             })
//         }
//         console.log(info)
//         res.json({
//             success: true,
//             message: "Send emial API",
//             body: body
//         })
//     });

// }

const fileController = {
    uploadFile,
    genrateLink,
    downloadaleLink,
    // sendEmail
}


module.exports = fileController