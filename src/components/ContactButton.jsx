import { IconArrowRight } from "@tabler/icons-react";
import React from "react";

const SaveButton = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`font-inherit text-md bg-white-50 text-white fill-gray-400 py-3 px-4 pl-5 flex items-center cursor-pointer border-none rounded-lg font-semibold group ${className}`}
    >
      <div className="svg-wrapper-1">
        <div className="svg-wrapper group-hover:scale-105 transition-transform duration-700 ease-linear">
          <IconArrowRight className="icon transform origin-center transition-transform duration-700 ease-in-out group-hover:translate-x-10 group-hover:scale-100 group-hover:fill-white font-medium" />
        </div>
      </div>
      <span className="ml-2 group-hover:opacity-0 transition-opacity duration-500 ease-linear">
        {children}
      </span>
    </button>
  );
};

export default SaveButton;
