import React from "react";
import { FaRegUser } from "react-icons/fa";
const ProfileImg = ({ src, size }) => {
  const sizeImg =
    size === "large"
      ? "w-24 h-24 md:w-30 md:h-30 lg:w-40 lg:h-40"
      : size === "medium"
      ? "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
      : "w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10";
  return (
    <>
      {src ? (
        <img
          src={src}
          loading="lazy"
          className={`${sizeImg} rounded-full border-2 border-white object-cover`}
          alt=""
        />
      ) : (
        <FaRegUser className={`${sizeImg} rounded-full border`} />
      )}
    </>
  );
};

export default ProfileImg;
