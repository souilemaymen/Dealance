import Footer from "@/home/Footer";
import NavbarMenu from "@/home/Navbar";
import React from "react";
import HeroService from "./HeroService";
import Categories from "./Categories";
import HowItWorks from "./HowItWorks";
import FeaturedFreelancer from "./FeaturedFreelancer";

const page = () => {
  return (
    <main>
      <NavbarMenu />
      <HeroService />
      <Categories />
      <HowItWorks />
      <FeaturedFreelancer />
      <Footer />
    </main>
  );
};

export default page;
