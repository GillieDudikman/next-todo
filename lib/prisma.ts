import {PrismaClient} from "@prisma/client";

const prismaClientSingletone = () => {
    return new PrismaClient();
}

type PrismaClientSingletone = ReturnType<typeof prismaClientSingletone>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingletone | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingletone()

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;