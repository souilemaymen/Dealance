import Footer from "@/home/Footer";
import React from "react";
import SignUp from "./SignUp";
import NavbarMenu from "@/home/Navbar";

const page = () => {
  return (
    <main>
      <NavbarMenu />
      <SignUp />
      <Footer />
    </main>
  );
};

export default page;
