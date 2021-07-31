import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/currentuser";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorhandler";
import { NotFoundError } from "./errors/not-found.error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

async function start() {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on 3000...");
  });
}

start();
