"use client"
import React from "react";
import MyAccount from "./MyAccount";
import NavbarMenuAcceuil from "@/components/NavbarMenuAcceuil";

const page = () => {
  return (
    <main>
        <NavbarMenuAcceuil/>
      <MyAccount />
    </main>
  );
};

export default page;