"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";
import ProgressBar from "./ScrollProgressLine";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";

export default function LayoutController({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <ProgressBar />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <Toast />}

      <main>{children}</main>

      {!isAdmin && <Footer />}
    </>
  );
}
