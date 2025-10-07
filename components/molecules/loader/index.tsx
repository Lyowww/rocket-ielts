"use client";
import React from "react";
import clsx from "clsx";

type LoaderProps = {
  size?: number;
  color?: string;
};

const Loader: React.FC<LoaderProps> = ({ size = 40, color = "text-white" }) => {
  return (
    <div
      className={clsx("relative animate-spin", color)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 border-4 border-t-transparent border-current rounded-full"
        style={{ borderWidth: size * 0.1 }}
      />
    </div>
  );
};

export default Loader;
