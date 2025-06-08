import { PrismaClient, Suggestion, Status } from '@prisma/client';

export async function getApprovedSuggestions(): Promise<Suggestion[]> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.findMany({
      where: { status: Status.APPROVED },
      select: {
        id: true,
        text: true,
        status: true,
        submittedAt: true,
      },
    });
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

export async function getAllSuggestions(): Promise<Suggestion[]> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.findMany();
  } finally {
    await prisma.$disconnect();
  }
}

export async function approveSuggestionById(id: number): Promise<Suggestion> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.update({
      where: { id },
      data: { status: Status.APPROVED },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteSuggestionById(id: number): Promise<Suggestion> {
  const prisma = new PrismaClient();
  try {
    return await prisma.suggestion.delete({ where: { id } });
  } finally {
    await prisma.$disconnect();
  }
}
