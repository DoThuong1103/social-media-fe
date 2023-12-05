import React from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
const FilesMess = ({ files }) => {
  return (
    <>
      <div
        className={` w-[96%]  mx-auto ${
          files?.length < 3
            ? "flex flex-col gap-1"
            : "grid grid-cols-2 gap-1"
        } `}
      >
        <div
          className={`max-h-[500px] ${
            files?.length > 2
              ? "grid grid-rows-2 gap-1"
              : "grid grid-rows-1 gap-1"
          }`}
        >
          {files?.map((file, index) => (
            <div
              className={`${index % 2 === 0 ? "" : "hidden"} ${
                index === 4 ? "hidden" : ""
              }`}
              key={index}
            >
              {file?.type?.includes("image") ? (
                <img
                  loading="lazy"
                  src={file?.link}
                  alt=""
                  className="h-full w-full object-cover "
                />
              ) : file?.type?.includes("video") ? (
                <video
                  src={file?.link}
                  alt=""
                  controls
                  className="h-full w-full object-cover "
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <div
          className={` ${
            files.length === 4
              ? "h-full max-h-[500px] grid grid-rows-2 gap-1"
              : ""
          } ${
            files.length > 4
              ? "h-full max-h-[500px] grid grid-rows-3 gap-1"
              : ""
          }`}
        >
          {files.map((file, index) => (
            <div
              className={`  ${
                index % 2 === 0 && index !== 4 ? "hidden" : ""
              } ${files.length === 3 ? "h-full" : ""} ${
                index > 4 ? " hidden" : "1"
              }`}
              key={index + 5}
            >
              {file?.type?.includes("image") ? (
                <img
                  loading="lazy"
                  src={file.link}
                  alt=""
                  className="h-full w-full object-cover "
                />
              ) : file?.type?.includes("video") ? (
                <video
                  src={file.link}
                  alt=""
                  controls
                  className="h-full w-full object-cover "
                />
              ) : (
                ""
              )}
              <div
                className={`absolute top-0 left-0 ${
                  files?.length > 5 && index === 4
                    ? "bg-slate-300 opacity-80 w-full h-full text-center items-center flex justify-center "
                    : "hidden"
                }`}
              >
                <span className="text-white opacity-100 z-20 text-8xl">
                  +{files?.length - 5}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="w-fit bg-[#F0F0F0] px-2 py-1 rounded-md order-1">
        {files.map(
          (file) =>
            !file?.type?.includes("video") &&
            !file?.type?.includes("image") && (
              <a
                className=""
                href={file.link}
                target="_blank"
                rel="noreferrer"
              >
                {file.name}
              </a>
            )
        )}
      </div> */}
    </>
  );
};

export default FilesMess;
