"use client";
import React from "react";
import { motion } from "framer-motion";
import { WorldMap } from "./component/WorldMap";
import Button from "@/components/Button";

const HeroService = () => {
  return (
    <section className="container pt-32">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-white-300 tracking-wider">
          Find the Right Freelancer for Your{" "}
          <span className="text-white-200">
            {"Next-Project".split("").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="~text-sm/lg text-white-200 max-w-2xl mx-auto py-4">
          From web development to content writing, connect with top talents.
        </p>
      </div>
      <WorldMap
        lineColor="#8361ca"
        dots={[
          {
            start: { lat: 20.8869, lng: 9.5375 }, // Tunisia
            end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
          },
          {
            start: { lat: 20.8869, lng: 9.5375 }, // Tunisia
            end: { lat: 28.6139, lng: 77.209 }, // Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // Delhi
            end: { lat: 51.5074, lng: -0.1278 }, // London
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
          {
            start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            end: { lat: -15.7975, lng: -47.8919 }, // Brasilia
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brasilia
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
        ]}
      />

      <div className="flex-col md:flex-row flex justify-center items-center space-y-6 md:space-y-0 md:space-x-24 mt-8">
        <Button titleClass="text-[10px] md:text-sm">Find Freelancers</Button>
        <Button titleClass="text-[10px] md:text-sm">Find Projects</Button>
      </div>
    </section>
  );
};

export default HeroService;
