import { redirect } from "next/navigation";

export default function RootRedirect() {
  redirect("/landing/home");
}
