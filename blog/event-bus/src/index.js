const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const events = [];

const POSTS_URL = process.env.POSTS_URL || "localhost";
const COMMENTS_URL = process.env.COMMENTS_URL || "localhost";
const QUERY_URL = process.env.QUERY_URL || "localhost";
const MODERATION_URL = process.env.MODERATION_URL || "localhost";

app.post("/events", (req, res) => {
  const event = req.body;

  console.log(`[event received]`, event);

  events.push(event);

  axios.post(`http://${POSTS_URL}:4000/events`, event).catch(() => {});
  axios.post(`http://${COMMENTS_URL}:4001/events`, event).catch(() => {});
  axios.post(`http://${QUERY_URL}:4002/events`, event).catch(() => {});
  axios.post(`http://${MODERATION_URL}:4003/events`, event).catch(() => {});

  res.send("OK");
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log("Listening on 4005..."));
