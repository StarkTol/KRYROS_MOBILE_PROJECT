import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function RootPage() {
  const hasToken = cookies().get("admin_token")?.value;
  if (hasToken) redirect("/admin");
  redirect("/login");
}
