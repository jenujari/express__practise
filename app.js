require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const morgan = require("morgan");

const app = express();
const keys=["jkhiguuyfguyk"];
const port = process.env.APP_PORT || 8080;
const ENV = process.env.APP_ENV || "prod";
const routesv1 = require("./routes");

if(ENV === "dev") {
  app.use(morgan("tiny"));
}

app.set("ENV",ENV);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:"applicatin/json"}));
app.use(express.static("public"));
app.use(cookieParser(keys));
app.use(cookieSession({
  name:"session",
  maxAge:24 * 60 * 60 * 1000,
  keys
}));

app.use("/api/v1",routesv1);

module.exports = {
  app, port
};
