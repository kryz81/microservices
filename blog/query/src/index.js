const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const EVENTS_URL = process.env.EVENTS_URL || "localhost";

function handleEvent(type, data) {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    if (!posts[postId]) {
      return res.status(400).send(`Post with ID ${postId} does not exist`);
    }
    posts[postId].comments.push({ id, content, postId, status });
  } else if (type === "CommentUpdated") {
    const { id, postId, content, status } = data;
    const comment = posts[postId].comments.find((item) => item.id === id);
    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
}

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log("[event received]", req.body);

  const { type, data } = req.body;

  handleEvent(type, data);

  res.send("OK");
});

app.listen(4002, async () => {
  console.log("Listening on 4002...");
  const res = await axios.get(`http://${EVENTS_URL}:4005/events`);
  for (let event of res.data) {
    console.log(`Processing event of type ${event.type}`);
    handleEvent(event.type, event.data);
  }
});
