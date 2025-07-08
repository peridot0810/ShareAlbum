import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스 생성
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// 애플리케이션 종료 시 Prisma 연결 정리
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
