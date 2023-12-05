import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { AiOutlineClose } from "react-icons/ai";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import ProfileImg from "./ProfileImg";
import Time from "../Time";
import Comments from "../Comments";
const ImagesContainer = ({
  images,
  post,
  handleComment,
  comments,
  setShow,
}) => {
  const [openImg, setOpenImg] = useState(false);
  const handleOpenImage = () => {
    setOpenImg(!openImg);
  };
  return (
    <>
      <div
        className={`${
          setShow ? "cursor-pointer" : ""
        }  w-[96%]  mx-auto ${
          images.length < 3 ? "" : "grid grid-cols-2 gap-1"
        } `}
        onClick={handleOpenImage}
      >
        <div
          className={`max-h-[500px] ${
            images.length > 2
              ? "grid grid-rows-2 gap-1"
              : "grid grid-rows-1 gap-1"
          }`}
        >
          {images.map((image, index) => (
            <div
              className={`${index % 2 === 0 ? "" : "hidden"} ${
                index === 4 ? "hidden" : ""
              }`}
              key={index}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover "
              />
            </div>
          ))}
        </div>
        <div
          className={`h-full max-h-[500px] ${
            images.length === 4 ? "grid grid-rows-2 gap-1" : ""
          } ${images.length > 4 ? "grid grid-rows-3 gap-1" : ""}`}
        >
          {images.map((image, index) => (
            <div
              className={`relative  ${
                index % 2 === 0 && index !== 4 ? "hidden" : ""
              } ${images.length === 3 ? "h-full" : ""} ${
                index > 4 ? " hidden" : "1"
              }`}
              key={index + 5}
            >
              <img
                className="h-full w-full object-cover"
                src={image}
                alt=""
              />
              <div
                className={`absolute top-0 left-0 ${
                  images.length > 5 && index === 4
                    ? "bg-slate-300 opacity-80 w-full h-full text-center items-center flex justify-center "
                    : "hidden"
                }`}
              >
                <span className="text-white opacity-100 z-20 text-8xl">
                  +{images.length - 5}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {setShow && openImg && (
        <div className="flex fixed w-screen h-screen max-h-screen bg-slate-400 top-0 left-0 z-[9999]">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="flex w-full mx-auto max-h-screen"
          >
            {images.map((image) => (
              <SwiperSlide className="my-auto w-full h-full">
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    className="w-[92%] h-[92%] object-contain "
                    src={image}
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex-1 bg-white ">
            <div className="hidden md:flex w-[300px] px-2 py-4 ">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <ProfileImg src={post.user.avatar}></ProfileImg>
                  <div className="flex flex-col">
                    <span>{post.user.username}</span>
                    <Time times={post.createdAt} />
                  </div>
                </div>
                <div>
                  <span>{post.title}</span>
                </div>
                <div>
                  <Comments
                    handleComment={handleComment}
                    post={post}
                    comments={comments}
                    maxHight={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute top-[20px] left-[20px] bg-slate-300 opacity-50 p-2 rounded-full hover:opacity-95 cursor-pointer z-50"
            onClick={handleOpenImage}
          >
            <AiOutlineClose />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesContainer;
