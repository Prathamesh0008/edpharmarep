// app/checkout/page.jsx
import { cookies } from "next/headers";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  return <CheckoutClient isLoggedIn={!!token} />;
}
