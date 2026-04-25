import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

type TypedRequest<T> = Request<{}, {}, T>;

type RegisterBody = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  city: string;
  neighborhood: string;
  address: string;
  type: "ENTREPRISE" | "INDIVIDUAL";
  rccm: string;
  ifu: string;
};

type LoginBody = {
  phone: string;
  password: string;
};

const registerCustomer = async (
  req: TypedRequest<RegisterBody>,
  res: Response,
) => {
  const {
    email,
    password,
    firstName,
    lastName,
    city,
    neighborhood,
    address,
    type,
    phone,
    rccm,
    ifu,
  } = req.body;

  const userExists = await prisma.customer.findUnique({ where: { phone } });

  if (type === "ENTREPRISE" && !rccm && !ifu) {
    return res
      .status(400)
      .json({ error: "Vous devez fournir votre RCCM et votre IFU" });
  }

  if (userExists) {
    return res
      .status(400)
      .json({ error: "Un compte existe déjà avec ce numéro de téléphone" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const customer = await prisma.customer.create({
    data: {
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phone,
      city,
      neighborhood,
      address,
      type,
    },
  });
  const token = generateToken(customer.id, res);
  res.status(201).json({
    status: "Success",
    data: { user: customer },
    token,
  });
};

const loginCustomer = async (req: TypedRequest<LoginBody>, res: Response) => {
  const { phone, password } = req.body;
  const customer = await prisma.customer.findUnique({
    where: { phone },
  });
  if (!customer) {
    return res.status(401).json({ error: "Email ou mot de passe incorrecte" });
  }
  const isPasswordValid = await bcrypt.compare(password, customer.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Email ou mot de passe incorrecte" });
  }
  const token = generateToken(customer.id, res);
  res.status(201).json({
    status: "Success",
    data: {
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    },
    token,
  });
};

const logoutCustomer = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ error: "Déconnecté avec succès" });
};

const getCustomers = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Vous n'avez pas les droits pour accéder à ces ressources",
    });
  }
  const customers = await prisma.customer.findMany();
  res.status(200).json({
    status: "Success",
    data: {
      customers: customers,
    },
  });
};

export { registerCustomer, loginCustomer, logoutCustomer, getCustomers };
