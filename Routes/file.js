const express = require("express")
const fileController = require("../Controller/file")


const route = express.Router()

route.post("/api/file", fileController.uploadFile) // uploading a file...

route.get("/file/:fileId", fileController.genrateLink) //to generate sharable/downloadabe link

route.get("/files/download/:fileId", fileController.downloadaleLink) // download the file directly

// route.post("/api/files/send", fileController.sendEmail) // it will send the downloadable link

module.exports = route;