import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const roles = ["ADMIN", "USER", "CUSTOMER"];

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

const main = async () => {
  console.log("Seeding started");

  for (const role of roles) {
    await prisma.role.create({
      data: {
        name: role,
      },
    });
    console.log("Seeding role: " + role);
  }

  console.log("Seeding over");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
