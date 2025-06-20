"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "./component/BentoGrid";
import { categories } from "@/index";

const Categories = () => {
  return (
    <section className="container">
      <BentoGrid className="max-w-4xl mx-auto">
        {categories.map(({ title, icon, header, description }, index) => (
          <BentoGridItem
            key={index}
            title={title}
            description={description}
            header={header}
            icon={icon}
            className={index === 3 || index === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Categories;
