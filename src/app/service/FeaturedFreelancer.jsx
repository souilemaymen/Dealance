import React from "react";
import { InfiniteMovingCards } from "./component/MovingCards";
import { testimonials } from "@/index";

const FeaturedFreelancer = () => {
  return (
    <section className="">
      <div className="rounded-md flex flex-col antialised items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>
    </section>
  );
};

export default FeaturedFreelancer;
