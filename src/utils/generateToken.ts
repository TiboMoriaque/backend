import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};
