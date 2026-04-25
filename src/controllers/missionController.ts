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
    adminDate,
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
      adminDate,
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
  const missions = await prisma.mission.findMany();
  res.status(200).json({
    status: "Success",
    data: {
      missions: missions,
    },
  });
};

export { createMission, getMissions };
