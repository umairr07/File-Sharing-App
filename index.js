const express = require("express")
const routes = require("./Routes/file")
const mongoose = require("mongoose")

const app = express()

mongoose.connect(process.env.DATABASE_URI)
    .then(() => console.log("Db connected successfully"))
    .catch((err) => console.log("Error connecting to Db", err))

app.use(express.json()) // converting incoming data into JSON payloads

app.use(routes)

app.listen(1212, () => {
    console.log("Server is up and running on port 1212")
})