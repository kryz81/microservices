const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const EVENTS_URL = process.env.EVENTS_URL || "localhost";

app.post("/events", (req, res) => {
  console.log("[event received]", req.body);

  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    axios.post(`http://${EVENTS_URL}:4005/events`, {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });
  }

  res.send("OK");
});

app.listen(4003, () => console.log("Listening on 4003..."));
