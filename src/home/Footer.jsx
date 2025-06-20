"use client";
import Ballpit from "@/components/Balls";
import React from "react";
import { footerCategories, footerLinks } from "../index";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden min-h-[500px] max-h-[500px] w-[100%]">
      <Ballpit
        count={60}
        gravity={0.5}
        wallBounce={0.85}
        colors={["#e7e3f1", "#826fae", "#5c4d7c"]}
        ambientIntensity={0.5}
        minSize={0.3}
        followCursor={false}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="bg-white-200/30 backdrop-blur-md rounded-lg px-6 py-4 w-[90%] max-w-4xl">
          <h2 className="text-xl font-bold uppercase">DealLance Tunisian</h2>
          <p className="text-sm opacity-80">
            Connecting freelancers & clients seamlessly
          </p>

          <ul className="flex justify-center gap-6 text-sm mt-4">
            {footerCategories.map(({ title, href }, index) => (
              <li key={index}>
                <a
                  onClick={() => router.push(href)}
                  className="hover:text-white-50 trasnition-all duration-200 ease-in cursor-pointer"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex justify-center gap-4 mt-4">
            {footerLinks.map(({ icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="text-xl hover:text-white-50 trasnition-all duration-200 ease-in"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-xs mt-4 opacity-75">
            © {new Date().getFullYear()} DealLance Tunisian. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
