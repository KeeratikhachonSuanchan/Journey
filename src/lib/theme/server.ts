import { cookies } from "next/headers";

export type Theme = "light" | "dark";

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  return cookieStore.get("theme")?.value === "light" ? "light" : "dark";
}
