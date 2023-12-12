import React, { useEffect, useRef, useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import { useSelector } from "react-redux";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { io } from "socket.io-client";
import axios from "axios";
import { GoFileMedia } from "react-icons/go";
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
import Files from "../CommonComponents/Img/Files";
import { notify } from "../../Redux/notify";
import FilesMess from "../CommonComponents/Img/FilesMess";
const ChatContainer = ({ currentChatUser, getUsers }) => {
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [files, setFiles] = useState([]);
  const userDetails = useSelector((state) => state.user);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [srcFiles, setSrcFiles] = useState([]);
  const [openImg, setOpenImg] = useState(false);
  const [listImg, setListImg] = useState([]);
  const [isSend, setIsSend] = useState(false);

  const user = userDetails.user;
  const id = user._id;
  const accessToken = userDetails.accessToken;
  const scrollRef = useRef();
  const socket = useRef();

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;

    // Convert FileList to an array
    const filesArray = Array.from(selectedFiles);
    setFiles(filesArray);

    const fileUrls = filesArray.map((item) => ({
      link: URL.createObjectURL(item),
      name: item.name,
      type: item.type,
    }));
    setSrcFiles((prevFiles) => [...prevFiles, ...fileUrls]);
  };

  const handleDeleteFile = async (name) => {
    const filesArray = await files.filter(
      (file) => file.name !== name
    );
    setFiles(filesArray);
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
      socket.current = io(
        "https://social-media-be-hxiw.onrender.com"
      );
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

  // const sendMsg = () => {
  //   if (inputMessage.trim().length > 0) {
  //     socket.current.emit("sendMsg", {
  //       message: inputMessage,
  //       from: id,
  //       to: currentChatUser._id,
  //     });
  //     axios
  //       .post(
  //         `${process.env.REACT_APP_BASE_URL}/message/msg`,
  //         {
  //           message: inputMessage,
  //           from: id,
  //           to: currentChatUser._id,
  //         },
  //         {
  //           headers: {
  //             token: `${accessToken}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setMessages([...messages, res.data]);
  //         getUsers();
  //         setInputMessage("");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };
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
    if (files && files.length > 0) {
      setIsSend(true);
      const promises = [];
      files?.forEach((image, index) => {
        const filename = new Date().getTime() + image.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        promises.push(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) *
                  100;
                // switch (snapshot.state) {
                //   case "paused":
                //     // Handle paused state
                //     break;
                //   case "running":
                //     // Handle running state
                //     break;
                // }
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

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      {currentChatUser && (
        <div className="flex px-4 items-center w-full h-16 bg-slate-500 gap-2">
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
            <label htmlFor="file" className="">
              <GoFileMedia className="h-6 w-6 p-[2px] ml-2 hover:bg-[#9e9e9e] transition-all rounded-sm " />
              <input
                type="file"
                name="file"
                id="file"
                style={{ display: "none" }}
                // accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
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
          {srcFiles.length > 0 && (
            <Files files={srcFiles} deleteFile={handleDeleteFile} />
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
