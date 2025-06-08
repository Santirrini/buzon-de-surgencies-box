import { PrismaClient, Suggestion, Status } from '@prisma/client';

export async function getApprovedSuggestions(): Promise<Suggestion[]> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.findMany({ where: { status: Status.APPROVED } });
  } finally {
    await prisma.$disconnect();
  }
}

export async function createSuggestion(text: string): Promise<Suggestion> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.create({ data: { text } });
  } finally {
    await prisma.$disconnect();
  }
}
