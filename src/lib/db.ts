import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrisma> | undefined;
};

function isAccelerateUrl(url: string) {
  return url.startsWith("prisma://") || url.startsWith("prisma+postgres://");
}

function createPrisma() {
  const url = process.env.DATABASE_URL!;

  if (isAccelerateUrl(url)) {
    return new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate());
  }

  const adapter = new PrismaPg(url);
  return new PrismaClient({ adapter });
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrisma();
  }
  return globalForPrisma.prisma;
}
