const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    newName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    }
})

const FileModel = mongoose.model("files", fileSchema)

module.exports = FileModel;