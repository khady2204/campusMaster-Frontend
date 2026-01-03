import { redirect } from "next/navigation";

export default function Home() {
  return (
    window.location.href = "/login",
    redirect("/login")
  );
}
