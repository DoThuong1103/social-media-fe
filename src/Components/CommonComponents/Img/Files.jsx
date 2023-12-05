import React from "react";
import { AiOutlineClose } from "react-icons/ai";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
const Files = ({ files, deleteFile }) => {
  return (
    <div className="flex gap-2 w-[400px] overflow-hidden overflow-x-scroll px-2 py-[2px]">
      {files.map((file) =>
        file?.type?.includes("image") ? (
          <div className="relative w-20 h-20 min-w-[80px] ">
            <img
              src={file.link}
              alt=""
              className="w-20 h-20 rounded-sm"
            />
            <div
              className="absolute top-0 right-0 cursor-pointer rounded-full bg-slate-100 bg-opacity-25 hover:bg-slate-200 hover:bg-opacity-100 transition-all"
              onClick={() => deleteFile(file.name)}
            >
              <AiOutlineClose />
            </div>
          </div>
        ) : file?.type?.includes("video") ? (
          <video
            src={file.link}
            alt=""
            controls
            className="h-full w-full "
          />
        ) : (
          <span className="bg-[#b4b3b3] px-2 py-1 rounded-md order-1">
            {file.name}
          </span>
        )
      )}
    </div>
  );
};

export default Files;
