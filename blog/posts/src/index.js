const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const EVENTS_URL = process.env.EVENTS_URL || "localhost";

console.log(EVENTS_URL);

//app.get("/posts", (req, res) => {
//  res.send(posts);
//});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post(`http://${EVENTS_URL}:4005/events`, {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("[event received]", req.body);
  res.send("OK");
});

app.listen(4000, () => {
  console.log("v4");
  console.log("Listening on 4000...");
});
