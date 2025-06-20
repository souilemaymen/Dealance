"use client";
import React, { useState } from "react";
import Preloader from "./Preloader";

const WrapperLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      {!loading && children}
    </>
  );
};

export default WrapperLoader;
