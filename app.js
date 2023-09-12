//import
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const logger = require("morgan");
//params
const app = express();
const port = 3000;
//ตัวแปลเก็บโดเมนที่อนุญาติให้เข้ามาที่ servers
var whitelist = ["http://example1.com", "http://example2.com"];
//Configuring cors origin
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      //ตัวอย่างผมอนุญาตุให้ผ่านเข้ามาทุกโดเมนหากอยากทดสอบว่า cors เวิคให้ให้เปิด คอมเม้น บรรทัดด้านล่าง
      // callback(new Error('Not allowed by CORS'))
      callback(null, true);
    }
  },
};
//config
// เป็นมิดเดิลแวร์สำหรับ แปลง body ให้เซิฟเวอร์สามารถเข้าใจได้
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//เป็นมิดเดิลแวสำหรับ Log request ที่ยิงเข้ามาที่เซอเวอร์เห็นได้ที่ terminal
app.use(logger("dev"));
//เป็นมิดเดิลแวสำหรับตั่งค่าให้สิทธ์โดเมนในการเข้าถึง servers
app.use(cors(corsOptions));
//เป็นมิดเดิลแวสำหรับตั่งค่าไฟล์ที่จะยอมรับให้เข้ามาใน server limits บอกถึงขนาดที่รองรับ 5242880 kb,
app.use(
  fileUpload({
    limits: { fieldSize: 5242880 },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World! API already use");
});

app.get("/about", (req, res) => {
  res.send("Hello about route");
});

app.get("/signup", (req, res, next) => {
  let options = {
    root: __dirname,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  };
  res.sendFile("/signup.html", options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: signup.html");
    }
  });
});

app.post("/", (req, res) => {
  console.log("req", req.body);
  res.status(200).json({ body: req.body });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
