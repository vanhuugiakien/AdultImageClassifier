const express = require("express");
const axios = require("axios").default;
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const imageToBase64 = require("image-to-base64");
const fs = require("fs");
app.use(bodyParser.urlencoded({
  extended: true
}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "TestPic -" + Date.now());
  },
});
var upload = multer({
  storage: storage
});

app.post("/uploadfile", upload.single("myFile"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  fs.renameSync(file.path, file.path + ".png");
  let base64 = await imageToBase64("./" + file.path.toString() + ".png");
  let request = {
    data: {

    }
  };
  request.data[file.filename] = base64;
  let result = await axios.post("http://localhost:3000/sync", request);
  res.send(result.data);
});
const config = {
  PORT: 6969,
  HOST: '0.0.0.0',
}
app.get('/', async (req, res) => {
  res.send({
    message: "Cái quần què"
  })
})
app.listen(config.PORT, config.HOST, () => {
  console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
});