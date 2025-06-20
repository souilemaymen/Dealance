"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../../../lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const speedDuration = {
        fast: "20s",
        normal: "40s",
        slow: "80s",
      };
      containerRef.current.style.setProperty(
        "--animation-duration",
        speedDuration[speed] || speedDuration.fast
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-[90rem] overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--white-200), var(--white-300))",
            }}
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <img
                src={item.image} // Add freelancer's image
                alt={item.name}
                className="rounded-full w-16 h-16 mb-4 mx-auto onject-cover" // Adjust size as needed
              />
              <span className="relative z-20 text-lg leading-[1.6] text-white-100 font-semibold">
                {item.name}{" "}
              </span>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-400 font-normal">
                {item.title}
              </span>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(item.rating))}
                </span>
                <span className="text-white-50 ml-2">
                  ({item.reviews} reviews)
                </span>
              </div>
              <div className="flex flex-wrap justify-center mt-2">
                {item.categories.map((category) => (
                  <span
                    key={category}
                    className="bg-blue-200 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold mr-1"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <p className="relative z-20 mt-4 text-center text-gray-300">
                {item.quote}
              </p>
              <div className="flex flex-wrap justify-center mt-4">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-600 text-white rounded-full px-2 py-1 text-xs font-semibold mr-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
