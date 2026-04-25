import { Request, Response } from "express";
import { prisma } from "../config/db";

const getRoles = async (req: Request, res: Response) => {
  if (req.user.roleId.name !== "ADMIN") {
    return res.status(401).json({
      error: "Vous n'êtes pas autorisé(e) à accéder à cette ressource",
    });
  }
  const roles = await prisma.role.findMany();
  res.status(200).json({
    status: "Success",
    data: {
      roles,
    },
  });
};

export { getRoles };
