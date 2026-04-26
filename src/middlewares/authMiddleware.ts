import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";

export const authMiddleware = async (req: Request, res: Response, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Connectez-vous pour accéder à ces ressources" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });
    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
    });

    if (!user && !customer) {
      return res.status(401).json({ error: "Cet utilisateur n'existe plus" });
    }
    if (user && !customer) {
      req.user = user;

      next();
      return;
    }
    if (!user && customer) {
      req.customer = customer;
      next();
    }
  } catch (error) {
    return res.status(400).json({
      error: "L'authentification a échoué. Veuillez reessayer " + error,
    });
  }
};
