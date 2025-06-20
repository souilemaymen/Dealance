import Footer from "@/home/Footer";
import React from "react";
import Login from "./Login";
import NavbarMenu from "@/home/Navbar";

const page = () => {
  return (
    <main>
      <NavbarMenu />
      <Login />
      <Footer />
    </main>
  );
};

export default page;
