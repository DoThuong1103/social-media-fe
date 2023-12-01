import React from "react";

const Icon = ({ src, pointer, size, onClick }) => {
  const sizeIcon =
    size === "large"
      ? "w-7 h-7"
      : size === "medium"
      ? "w-6 h-6"
      : "w-5 h-5";
  return (
    <img
      className={` ${sizeIcon} ${
        pointer ? " cursor-pointer" : " cursor-default"
      }`}
      src={src}
      alt=""
      onClick={onClick}
    />
  );
};

export default Icon;
