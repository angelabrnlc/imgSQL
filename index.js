const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("./public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: "8889",
  database: "imgSQL",
});

db.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Conectado y a topisimo");
  }
});

let storage = multer.diskStorage({
  destination: "./public/images/",
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/post", upload.single("image"), (req, res) => {
  console.log(req.body.image);
  if (!req.file) {
    console.log("No se ha enviado ningún archivo");
  } else {
    console.log(req.file.filename);
    let imgsrc = "http://localhost:3000/images/" + req.file.filename;
    let insert = `INSERT INTO users_file (user_name, file_src) VALUES ("${req.body.user_name}", "${imgsrc}")`;
    db.query(insert, (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("Archivo introducido en la BD");
      }
    });
  }
});

app.listen(3000, () => {
  console.log("El servidor está levantado");
});
