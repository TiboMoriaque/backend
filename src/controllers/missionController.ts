import { Request, Response } from "express";
import { prisma } from "../config/db";

type TypedRequest<T> = Request<{}, {}, T>;

type CreateMissionBody = {
  city: string;
  neighborhood: string;
  customerDate: string;
  adminDate: string;
  address: string;
  description: string;
  status:
    | "NEW"
    | "PRICE_SET"
    | "PRICE_AGREED"
    | "PLANNED"
    | "ONGOING"
    | "DONE"
    | "REJECTED";
  provisionnalBudget: number;
  type: "MOVEOUT" | "HOUSECLEANING" | "DELIVERY" | "SERVICE";
  withBox: boolean;
  deliveryPlace?: string;
  finalPrice?: number;
  customerId: string;
};

type UpdateMissionBody = {
  adminDate?: string;
  status?:
    | "NEW"
    | "PRICE_SET"
    | "PRICE_AGREED"
    | "PLANNED"
    | "ONGOING"
    | "DONE"
    | "REJECTED";
  finalPrice?: number;
  teamId?: string;
  userId?: string;
};

const createMission = async (
  req: TypedRequest<CreateMissionBody>,
  res: Response,
) => {
  const {
    city,
    neighborhood,
    address,
    description,
    status,
    provisionnalBudget,
    type,
    withBox,
    deliveryPlace,
    finalPrice,
    customerId,
    customerDate,
  } = req.body;

  const mission = await prisma.mission.create({
    data: {
      city,
      neighborhood,
      address,
      description,
      status: status ? status : "NEW",
      provisionnalBudget,
      type,
      withBox,
      deliveryPlace,
      finalPrice,
      customerId,
      customerDate,
    },
  });
  res.status(201).json({
    status: "Success",
    data: {
      mission: mission,
    },
  });
};

const getMissions = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ error: "Vous n'êtes pas autorisé à accéder à ces ressources" });
  }
  const missions = await prisma.mission.findMany({
    include: { team: true, user: true, orderedBy: true },
  });
  res.status(200).json({
    status: "Success",
    data: {
      missions: missions,
    },
  });
};

const updateMission = async (
  req: TypedRequest<UpdateMissionBody>,
  res: Response,
) => {
  const { adminDate, status, finalPrice, userId, teamId } = req.body;
  const existingMission = await prisma.mission.findUnique({
    where: { id: req.params.id },
  });
  if (!existingMission) {
    return res.status(404).json({ error: "Mission non trouvée" });
  }
  const updatedMission = await prisma.mission.update({
    where: { id: req.params.id },
    data: { adminDate, status, finalPrice, userId, teamId },
  });
  res.status(200).json({
    status: "Success",
    data: {
      mission: updatedMission,
    },
  });
};

export { createMission, getMissions, updateMission };
