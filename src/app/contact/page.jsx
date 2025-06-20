import React from "react";
import ContactUs from "./ContactUs";
import Footer from "@/home/Footer";
import NavbarMenu from "@/home/Navbar";

const page = () => {
  return (
    <main>
      <NavbarMenu />
      <ContactUs />
      <Footer />
    </main>
  );
};

export default page;
