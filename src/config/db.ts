import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

const connectToDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected...");
  } catch (error) {
    console.error("An error occured during connection to the db");
  }
};

const disConnecteToDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectToDB, disConnecteToDB };
