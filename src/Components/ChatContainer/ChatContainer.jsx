import React, { useEffect, useRef, useState } from "react";
import ProfileImg from "../CommonComponents/Img/ProfileImg";
import { useSelector } from "react-redux";
import { AiOutlineSend } from "react-icons/ai";
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
const ChatContainer = ({ currentChatUser, getUsers }) => {
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [files, setFiles] = useState([]);
  const userDetails = useSelector((state) => state.user);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;

    console.log(selectedFiles);
    // Convert FileList to an array
    const filesArray = Array.from(selectedFiles);
    setFiles(filesArray);
  };

  const user = userDetails.user;
  const id = user.other._id;
  const accessToken = user.accessToken;
  const scrollRef = useRef();
  const socket = useRef();
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    if (currentChatUser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("addUser", id);
    }
  }, [id, currentChatUser]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${id}/${currentChatUser._id}`,
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

  const sendMsg = () => {
    if (inputMessage.trim().length > 0) {
      socket.current.emit("sendMsg", {
        message: inputMessage,
        from: id,
        to: currentChatUser._id,
      });
      axios
        .post(
          `http://localhost:5000/api/message/msg`,
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ mySelf: false, message: msg });
      });
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage, socket.current]);
  useEffect(() => {
    arrivalMessage && setMessages((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);
  // const handlePost = (e) => {
  //   e.preventDefault();
  //   if (files && files.length > 0) {
  //     const promises = [];
  //     files?.forEach((image, index) => {
  //       const filename = new Date().getTime() + image.name;
  //       const storage = getStorage(app);
  //       const storageRef = ref(storage, filename);
  //       const uploadTask = uploadBytesResumable(storageRef, image);

  //       promises.push(
  //         new Promise((resolve, reject) => {
  //           uploadTask.on(
  //             "state_changed",
  //             (snapshot) => {
  //               // Observe state change events such as progress, pause, and resume
  //               const progress =
  //                 (snapshot.bytesTransferred / snapshot.totalBytes) *
  //                 100;
  //               // switch (snapshot.state) {
  //               //   case "paused":
  //               //     // Handle paused state
  //               //     break;
  //               //   case "running":
  //               //     // Handle running state
  //               //     break;
  //               // }
  //               return progress;
  //             },
  //             (error) => {
  //               // Handle unsuccessful uploads
  //               reject(error);
  //             },
  //             () => {
  //               // Handle successful uploads on complete
  //               getDownloadURL(uploadTask.snapshot.ref)
  //                 .then((downloadURL) => {
  //                   resolve(downloadURL);
  //                 })
  //                 .catch((error) => {
  //                   reject(error);
  //                 });
  //             }
  //           );
  //         })
  //       );
  //     });

  //     // Wait for all promises to resolve (i.e., all uploads to complete)
  //     Promise.all(promises)
  //       .then((downloadURLs) => {
  //         // All uploads are complete, you can now use the downloadURLs array
  //         // to send data to your server or perform any other actions
  //         axios
  //           .post(
  //             `http://localhost:5000/api/message/msg`,
  //             {
  //               message: inputMessage,
  //               from: id,
  //               to: currentChatUser._id,
  //               files: downloadURLs,
  //             },
  //             {
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 token: userDetails.user.accessToken,
  //               },
  //             }
  //           )
  //           .then((data) => {
  //             setMessages([...messages, data.data]);
  //             setInputMessage("");
  //             setFiles([]);

  //             // alert("Your Posts were uploaded successfully");
  //             // window.location.reload(true);
  //           })
  //           .catch((error) => {
  //             // Handle error from the server
  //           });
  //       })
  //       .catch((error) => {
  //         // Handle any errors during the upload process
  //       });
  //   }
  // };

  return (
    <div className="flex-1 flex flex-col items-center gap-4">
      {currentChatUser && (
        <div className="flex px-4 items-center w-full h-16 bg-slate-500 gap-2">
          <ProfileImg src={currentChatUser.avatar} size="medium" />
          <span className="text-lg">{currentChatUser.username}</span>
        </div>
      )}
      <div className="flex flex-col w-full h-full justify-between">
        <div className="flex flex-col w-full h-full px-6 pb-2 gap-4 flex-1 overflow-hidden overflow-y-scroll chat-container">
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
                      ? user.other.avatar
                      : currentChatUser.avatar
                  }
                />
              </div>
              <span className="bg-[#F0F0F0] px-2 py-1 rounded-md order-1 max-w-[90%] md:max-w-[60%]">
                {message.message}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 w-[96%] mx-auto mb-3 py-1 bg-[#F0F0F0] rounded-lg items-center ">
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
          <div alt="Send" className="cursor-pointer">
            <AiOutlineSend
              className="h-8 w-8 mr-2 p-[4px] hover:bg-[#9e9e9e] transition-all rounded-full"
              onClick={sendMsg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
