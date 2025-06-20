import TextPressure from "@/components/TextP";
import React from "react";

const LastSec = () => {
  return (
    <div>
      <TextPressure
        text="Deal!"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#302546"
        strokeColor="#ff0000"
        minFontSize={6}
      />
    </div>
  );
};

export default LastSec;
