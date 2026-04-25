import { Request, Response } from "express";
import { prisma } from "../config/db";

const getConnectedUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { roleId: true },
  });
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.roleId,
      },
    },
  });
};

const getUsers = async (req: Request, res: Response) => {
  if (req.user.roleId.name !== "ADMIN") {
    return res.status(401).json({
      error: "Vous n'êtes pas autorisé(e) à accéder à cette ressource",
    });
  }

  const users = await prisma.user.findMany({
    where: { id: { not: req.user.id } },
    include: { roleId: true, teams: true },
  });
  const formatedUser = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.roleId,
    teams: user.teams,
  }));
  res.status(200).json({
    status: "Success",
    data: {
      users: formatedUser,
    },
  });
};

export { getConnectedUser, getUsers };
