const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

const EVENTS_URL = process.env.EVENTS_URL || "localhost";

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, postId, status: "pending" });

  commentsByPostId[postId] = comments;

  await axios.post(`http://${EVENTS_URL}:4005/events`, {
    type: "CommentCreated",
    data: { id: commentId, content, postId, status: "pending" },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("[event received]", req.body);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((item) => item.id === id);
    comment.status = status;

    axios.post(`http://${EVENTS_URL}:4005/events`, {
      type: "CommentUpdated",
      data: comment,
    });
  }

  res.send("OK");
});

app.listen(4001, () => console.log("Listening on 4001..."));
