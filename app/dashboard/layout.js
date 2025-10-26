import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/cookie-auth";

export const metadata = { title: "NIEMR Dashboard" };

export default async function DashboardLayout({ children }) {
  const jar = await cookies();
  let access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  if (!access && refresh) {
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
    });
    const freshJar = await cookies();
    access = freshJar.get(ACCESS_COOKIE)?.value;
  }

  if (!access) redirect("/login");
  return <section className="min-h-screen bg-white">{children}</section>;
}
