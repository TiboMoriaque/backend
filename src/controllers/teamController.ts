import { Request, Response } from "express";
import { prisma } from "../config/db";

type TypedRequest<T> = Request<{}, {}, T>;
type BodyRequest = {
  name: string;
  users: string[];
};
const createTeam = async (req: TypedRequest<BodyRequest>, res: Response) => {
  const { name, users } = req.body;
  const team = await prisma.team.create({
    data: {
      name,
      users: { connect: users.map((id) => ({ id })) },
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      team: team,
    },
  });
};

const getTeams = async (req: Request, res: Response) => {
  const teams = await prisma.team.findMany({
    include: { users: { include: { roleId: true } } },
  });
  res.status(200).json({
    status: "Success",
    data: {
      teams: teams,
    },
  });
};

export { createTeam, getTeams };
