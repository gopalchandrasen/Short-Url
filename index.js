const express = require("express");
const app = express();
const path = require("path");
const { connectToMongoDB } = require("./connect");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly } = require("./middleware/auth");
const PORT = 8002;

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

app.use("/", urlRoute);
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);

app.listen(PORT, () =>
  console.log(`Server started at port http://localhost:${PORT}`)
);
