import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import ProfileImg from "../CommonComponents/Img/ProfileImg";
import Files from "../CommonComponents/Img/Files";
import { notify } from "../../Redux/notify";
import FilesMess from "../CommonComponents/Img/FilesMess";

import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import {
  GoFileMedia,
  GoVideo,
} from "react-icons/go";
const ChatContainer = ({ currentChatUser, getUsers }) => {
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [srcFiles, setSrcFiles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [srcVideos, setSrcVideos] = useState([]);

  const userDetails = useSelector((state) => state.user);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [srcImages, setSrcImages] = useState([]);
  const [openImg, setOpenImg] = useState(false);
  const [listImg, setListImg] = useState([]);
  const [isSend, setIsSend] = useState(false);

  const user = userDetails.user;
  const id = user._id;
  const accessToken = userDetails.accessToken;
  const scrollRef = useRef();
  const socket = useRef();

  const handleImageChange = (e) => {
    setFiles([]);
    setSrcFiles([]);
    setVideos([]);
    setSrcVideos([]);
    const selectedImages = e.target.files;
    // Convert FileList to an array
    const imageArray = Array.from(selectedImages);
    setImages(imageArray);

    const imageUrls = imageArray.map((item) => ({
      link: URL.createObjectURL(item),
      name: item.name,
      type: item.type,
    }));
    setSrcImages((prevFiles) => [...prevFiles, ...imageUrls]);
  };

  const handleDeleteImage = async (name) => {
    const imageArray = await images.filter(
      (file) => file.name !== name
    );
    setImages(imageArray);
    const filterImages = await srcImages.filter(
      (file) => file.name !== name
    );
    setSrcImages(filterImages);
  };

  const handleVideoChange = (e) => {
    setFiles([]);
    setSrcFiles([]);
    setImages([]);
    setSrcImages([]);
    const selectedVideos = e.target.files;
    // Convert FileList to an array
    const videoArray = Array.from(selectedVideos);
    setVideos(videoArray);

    const videoUrls = videoArray.map((item) => ({
      link: URL.createObjectURL(item),
      name: item.name,
      type: item.type,
    }));
    setSrcVideos((prevFiles) => [...prevFiles, ...videoUrls]);
  };

  const handleDeleteVideo = async (name) => {
    const videoArray = await videos.filter(
      (file) => file.name !== name
    );
    setVideos(videoArray);
    const filterVideos = await srcVideos.filter(
      (file) => file.name !== name
    );
    setSrcVideos(filterVideos);
  };

  const handleFileChange = (e) => {
    setImages([]);
    setSrcImages([]);
    setVideos([]);
    setSrcVideos([]);
    const selectedFiles = e.target.files;
    // Convert FileList to an array
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);

    const fileUrls = fileArray.map((item) => ({
      link: URL.createObjectURL(item),
      name: item.name,
      type: item.type,
    }));
    setSrcFiles((prevFiles) => [...prevFiles, ...fileUrls]);
  };

  const handleDeleteFile = async (name) => {
    const fileArray = await files.filter(
      (file) => file.name !== name
    );
    setImages(fileArray);
    const filterFiles = await srcFiles.filter(
      (file) => file.name !== name
    );
    setSrcFiles(filterFiles);
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChatUser) {
      socket.current = io(process.env.REACT_APP_BACK_END_IO_URL);
      socket.current.emit("addUser", id);
    }
  }, [id, currentChatUser]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/message/${id}/${currentChatUser._id}`,
          {
            headers: {
              token: `${accessToken}`,
            },
          }
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatUser]);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({
          mySelf: false,
          message: msg.message,
          files: msg.files,
        });
        getUsers();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage, socket.current]);

  useEffect(() => {
    arrivalMessage && setMessages((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);

  const sendMsg = (e) => {
    e.preventDefault();
    if (images && images.length > 0) {
      setIsSend(true);
      const promises = [];
      for (const image of images) {
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              const webpBlob = await new Promise((blobResolve) => {
                // Tạo một đối tượng hình ảnh
                const img = new Image();
                img.onload = () => {
                  // Tạo một canvas để chứa hình ảnh
                  const canvas = document.createElement("canvas");
                  canvas.width =
                    img.naturalWidth > 1000 &&
                    img.naturalHeight > 1000
                      ? img.naturalWidth * (3 / 4)
                      : img.naturalWidth;
                  canvas.height =
                    img.naturalWidth > 1000 &&
                    img.naturalHeight > 1000
                      ? img.naturalHeight * (3 / 4)
                      : img.naturalHeight;
                  const ctx = canvas.getContext("2d");

                  // Vẽ hình ảnh lên canvas
                  ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );

                  // Chuyển canvas thành Blob định dạng WebP
                  canvas.toBlob((blob) => {
                    blobResolve(blob);
                  }, "image/webp");
                };

                // Thiết lập nguồn hình ảnh từ File
                img.src = URL.createObjectURL(image);
              });

              // Upload ảnh WebP lên Firebase
              const filename =
                new Date().getTime() + `${image.name}.webp`;
              const storage = getStorage();
              const storageRef = ref(storage, filename);
              const uploadTask = uploadBytesResumable(
                storageRef,
                webpBlob
              );

              uploadTask.on(
                "state_changed",
                // Các bước theo dõi tiến trình upload (nếu cần)
                // ...
                () => {},
                (error) => {
                  console.log(error);
                  // Xử lý lỗi upload
                  reject(error);
                },
                () => {
                  // Upload thành công, lấy URL và tiếp tục xử lý post
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      resolve(downloadURL);
                    })
                    .catch((error) => {
                      reject(error);
                    });
                }
              );
            } catch (error) {
              console.error("Error converting image to WebP:", error);
              reject(error);
            }
          })
        );
      }

      // Wait for all promises to resolve (i.e., all uploads to complete)
      Promise.all(promises)
        .then((downloadURLs) => {
          // All uploads are complete, you can now use the downloadURLs array
          // to send data to your server or perform any other actions
          const formattedFiles = downloadURLs.map((url, index) => ({
            link: url,
            name: images[index].name,
            type: images[index].type,
          }));

          socket.current.emit("sendMsg", {
            message: inputMessage,
            from: id,
            to: currentChatUser._id,
            files: formattedFiles,
          });
          axios
            .post(
              `${process.env.REACT_APP_BACK_END_URL}/message/msg`,
              {
                message: inputMessage ? inputMessage : "",
                from: id,
                to: currentChatUser._id,
                files: formattedFiles,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  token: userDetails.accessToken,
                },
              }
            )
            .then((data) => {
              setMessages([...messages, data.data]);
              setInputMessage("");
              setImages([]);
              setSrcImages([]);
              setIsSend(false);
            })
            .catch((error) => {
              setIsSend(false);
              notify(
                "error",
                "An error occurred. Please try again later!"
              );
            });
        })
        .catch((error) => {
          setIsSend(false);
          notify(
            "error",
            "An error occurred. Please try again later!"
          );
        });
    } else if (files && files.length > 0) {
      setIsSend(true);
      const promises = [];
      files?.forEach((file, index) => {
        const filename = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, file);

        promises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) *
                  100;
                switch (snapshot.state) {
                  case "paused":
                    // Handle paused state
                    break;
                  case "running":
                    // Handle running state
                    break;
                }
                return progress;
              },
              (error) => {
                // Handle unsuccessful uploads
                reject(error);
              },
              () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    resolve(downloadURL);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            );
          })
        );
      });

      // Wait for all promises to resolve (i.e., all uploads to complete)
      Promise.all(promises)
        .then((downloadURLs) => {
          // All uploads are complete, you can now use the downloadURLs array
          // to send data to your server or perform any other actions
          const formattedFiles = downloadURLs.map((url, index) => ({
            link: url,
            name: files[index].name,
            type: files[index].type,
          }));

          socket.current.emit("sendMsg", {
            message: inputMessage,
            from: id,
            to: currentChatUser._id,
            files: formattedFiles,
          });
          axios
            .post(
              `${process.env.REACT_APP_BACK_END_URL}/message/msg`,
              {
                message: inputMessage ? inputMessage : "",
                from: id,
                to: currentChatUser._id,
                files: formattedFiles,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  token: userDetails.accessToken,
                },
              }
            )
            .then((data) => {
              setMessages([...messages, data.data]);
              setInputMessage("");
              setFiles([]);
              setSrcFiles([]);
              setIsSend(false);
            })
            .catch((error) => {
              setIsSend(false);
              notify(
                "error",
                "An error occurred. Please try again later!"
              );
            });
        })
        .catch((error) => {
          setIsSend(false);
          notify(
            "error",
            "An error occurred. Please try again later!"
          );
        });
    } else if (videos && videos.length > 0) {
      setIsSend(true);
      const promises = [];
      videos?.forEach((video, index) => {
        const filename = new Date().getTime() + video.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, video);

        promises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) *
                  100;
                switch (snapshot.state) {
                  case "paused":
                    // Handle paused state
                    break;
                  case "running":
                    // Handle running state
                    break;
                }
                return progress;
              },
              (error) => {
                // Handle unsuccessful uploads
                reject(error);
              },
              () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    resolve(downloadURL);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            );
          })
        );
      });

      // Wait for all promises to resolve (i.e., all uploads to complete)
      Promise.all(promises).then((downloadURLs) => {
        // All uploads are complete, you can now use the downloadURLs array
        // to send data to your server or perform any other actions
        console.log(downloadURLs);
        const formattedFiles = downloadURLs.map((url, index) => ({
          link: url,
          name: videos[index].name,
          type: videos[index].type,
        }));

        socket.current.emit("sendMsg", {
          message: inputMessage,
          from: id,
          to: currentChatUser._id,
          files: formattedFiles,
        });
        axios
          .post(
            `${process.env.REACT_APP_BACK_END_URL}/message/msg`,
            {
              message: inputMessage ? inputMessage : "",
              from: id,
              to: currentChatUser._id,
              files: formattedFiles,
            },
            {
              headers: {
                "Content-Type": "application/json",
                token: userDetails.accessToken,
              },
            }
          )
          .then((data) => {
            setMessages([...messages, data.data]);
            setInputMessage("");
            setFiles([]);
            setSrcFiles([]);
            setIsSend(false);
          })
          .catch((error) => {
            setIsSend(false);
            console.log(error);
            notify(
              "error",
              "An error occurred. Please try again later!"
            );
          });
      });
      // .catch((error) => {
      //   setIsSend(false);
      //   console.log(error);
      //   notify(
      //     "error",
      //     "An error occurred. Please try again later22!"
      //   );
      // });
    } else {
      socket.current.emit("sendMsg", {
        message: inputMessage,
        from: id,
        to: currentChatUser._id,
      });
      axios
        .post(
          `${process.env.REACT_APP_BACK_END_URL}/message/msg`,
          {
            message: inputMessage,
            from: id,
            to: currentChatUser._id,
          },
          {
            headers: {
              token: `${accessToken}`,
            },
          }
        )
        .then((res) => {
          setMessages([...messages, res.data]);
          getUsers();
          setInputMessage("");
          setIsSend(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleOpenImg = (data) => {
    setOpenImg(!openImg);
    setListImg(data);
  };

  useEffect(() => {
    setFiles([]);
    setSrcFiles([]);
    setImages([]);
    setSrcImages([]);
    setVideos([]);
    setSrcVideos([]);
  }, [currentChatUser]);

  return (
    <div className="flex-1 flex flex-col items-center gap-4 ">
      {currentChatUser && (
        <div className="flex px-4 items-center w-full h-[70px] bg-slate-500 gap-2 pt-2">
          <ProfileImg src={currentChatUser.avatar} size="medium" />
          <span className="text-lg">{currentChatUser.username}</span>
        </div>
      )}
      <div
        className="flex flex-col w-full h-full justify-between"
        style={{ maxHeight: "calc(100vh - 64px - 56px)" }}
      >
        <div className="flex flex-col w-full h-full px-6 pb-2 gap-8 flex-1 overflow-hidden overflow-y-scroll chat-container">
          {messages?.map((message, index) => (
            <div
              key={index}
              ref={scrollRef}
              className={`flex w-full  gap-2 items-center ${
                message.sender === id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`${message.sender === id ? "hidden" : ""}`}
              >
                <ProfileImg
                  src={
                    message.mySelf
                      ? user.avatar
                      : currentChatUser.avatar
                  }
                />
              </div>
              <div
                className={`flex flex-col gap-2 max-w-[90%] md:max-w-[60%] ${
                  message.sender === id ? "text-end" : ""
                } `}
              >
                {message.message && (
                  <div>
                    <span className="bg-[#F0F0F0] px-2 py-1 rounded-md order-1 ">
                      {message.message}
                    </span>
                  </div>
                )}
                {message?.files && (
                  <>
                    <div
                      className={`w-[40%] ${
                        message.sender === id ? "ml-auto" : ""
                      }`}
                      onClick={() => {
                        handleOpenImg(message?.files);
                      }}
                    >
                      <FilesMess files={message?.files} />
                    </div>

                    {message?.files.map(
                      (file, index) =>
                        !file?.type?.includes("video") &&
                        !file?.type?.includes("image") && (
                          <div className="bg-[#F0F0F0] px-2 py-1 rounded-md order-1">
                            <a
                              className=""
                              href={file.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {file.name}
                            </a>
                          </div>
                        )
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 w-[96%] mx-auto mb-3 py-1 bg-[#F0F0F0] rounded-lg items-start ">
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-1 items-center">
              <label htmlFor="image" className="">
                <GoFileMedia className="h-6 w-6 p-[2px] ml-2 hover:bg-[#9e9e9e] transition-all rounded-sm " />
                <input
                  type="file"
                  name="image"
                  id="image"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
              <label htmlFor="video" className="">
                <GoVideo className="h-6 w-6 p-[2px] ml-2 hover:bg-[#9e9e9e] transition-all rounded-sm " />
                <input
                  type="file"
                  name="video"
                  id="video"
                  style={{ display: "none" }}
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </label>
              <label htmlFor="file" className="">
                <MdAttachFile className="h-6 w-6 p-[2px] ml-2 hover:bg-[#9e9e9e] transition-all rounded-sm" />
                <input
                  type="file"
                  name="file"
                  id="file"
                  style={{ display: "none" }}
                  accept=".doc, .pdf, .txt, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <input
              type="text"
              className=" px-2 w-full bg-transparent outline-none"
              placeholder="Aaa"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
            />

            {isSend ? (
              <div className="flex items-center justify-center p-[4px] mr-2">
                <l-tailspin
                  size="24"
                  stroke="3"
                  speed="1"
                  color="black"
                ></l-tailspin>
              </div>
            ) : (
              <div alt="Send" className="cursor-pointer">
                <AiOutlineSend
                  className="h-7 w-7 mr-2  hover:bg-[#9e9e9e] transition-all rounded-full"
                  onClick={sendMsg}
                />
              </div>
            )}
          </div>
          {srcImages.length > 0 && (
            <Files files={srcImages} deleteFile={handleDeleteImage} />
          )}
          {srcFiles.length > 0 && (
            <Files files={srcFiles} deleteFile={handleDeleteFile} />
          )}{" "}
          {srcVideos.length > 0 && (
            <Files files={srcVideos} deleteFile={handleDeleteVideo} />
          )}
        </div>
      </div>
      {openImg && (
        <div className="fixed flex w-screen h-screen max-h-screen bg-slate-400 top-0 left-0 z-[9999]">
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="flex w-full mx-auto max-h-screen"
          >
            {listImg?.map((img) => (
              <SwiperSlide className="my-auto w-full h-full">
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    className="w-[88%] h-[88%] object-contain "
                    src={img.link}
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="absolute top-[20px] left-[20px] bg-slate-300 opacity-50 p-2 rounded-full hover:opacity-95 cursor-pointer z-50"
            onClick={() => setOpenImg(!openImg)}
          >
            <AiOutlineClose />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
