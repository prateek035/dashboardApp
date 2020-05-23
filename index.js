const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Setting the storage destination for upload file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

var upload = multer({ storage });

// @api /upload
// DESC : upload xlsx sheet on server and run pythn script

app.post("/upload", upload.single("file"), function (req, res) {
  console.log("++++++++++++++++++++++++++++++++++++");
  console.log("file file : ", req.file);
  console.log("++++++++++++++++++++++++++++++++++++");

  var spawn = require("child_process").spawn;

  var process = spawn("python", [
    "./DataInsertScript.py",
    req.file.destination + "/" + req.file.filename,
  ]);

  process.stdout.on("data", (data) => {
    console.log("Magic is going to happen ::");
    dataToSend = data.toString();
  });

  process.on("close", (code) => {
    console.log("Script has run successfully!");
    res.status(200).send(dataToSend);
  });
});

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
