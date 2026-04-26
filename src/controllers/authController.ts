import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

type TypedRequest<T> = Request<{}, {}, T>;

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
  role: string;
};

type LoginBody = {
  email: string;
  password: string;
};

const register = async (req: TypedRequest<RegisterBody>, res: Response) => {
  const { email, password, firstName, lastName, roleId, role } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    return res.status(400).json({ error: "Ce compte existe déjà" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roleId,
    },
  });
  const token = generateToken(user.id, res);
  res.status(201).json({
    status: "Success",
    data: { user: user },
    token,
  });
};

const login = async (req: TypedRequest<LoginBody>, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) {
    return res.status(401).json({ error: "Email ou mot de passe incorrecte1" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Email ou mot de passe incorrecte2" });
  }
  const token = generateToken(user.id, res);
  res.status(201).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleId,
      },
    },
    token,
  });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ error: "Déconnecté avec succès" });
};

export { register, login, logout };
