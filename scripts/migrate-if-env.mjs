import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn(
    "[build] DATABASE_URL tidak diset — lewati prisma migrate deploy. " +
      "Set DATABASE_URL di Vercel Environment Variables lalu redeploy.",
  );
  process.exit(0);
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
