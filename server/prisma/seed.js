import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.tb_user.upsert({
    where: {
      username: "dosen",
    },
    update: {},
    create: {
      username: "dosen",
      nama: "Alice",
      role: "Dosen",
      no_induk: "081241253",
      password: await argon2.hash("dosen"),
    },
  });

  const bob = await prisma.tb_user.upsert({
    where: {
      username: "aslab",
    },
    update: {},
    create: {
      username: "aslab",
      nama: "Bob",
      role: "Asisten Lab",
      no_induk: "209012042124",
      penjurusan: "Jaringan",
      no_telp: "08121414",
      password: await argon2.hash("aslab"),
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
