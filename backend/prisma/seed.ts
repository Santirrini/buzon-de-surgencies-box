import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
