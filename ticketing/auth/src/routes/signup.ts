import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation.error";
import { DatabaseConnectionError } from "../errors/database-connection.error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must contain at least 5 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    throw new DatabaseConnectionError();

    const { email, password } = req.body;
  }
);

export { router as signUpRouter };
