import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { useSelector } from "react-redux";

import ProfileImg from "../CommonComponents/Img/ProfileImg";
import Icon from "../CommonComponents/Img/Icon";
import app from "../../firebase";
import ImagesContainer from "../CommonComponents/Img/ImagesContainer";
import { notify } from "../../Redux/notify";
import ImageIcon from "../../Images/gallery.png";
import VideoIcon from "../../Images/video.png";

const ContentPost = ({ getPost, groupId }) => {
  const userDetails = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [srcImages, setSrcImages] = useState([]);
  const [srcVideo, setSrcVideo] = useState(null);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;

    // Convert FileList to an array
    const filesArray = Array.from(selectedFiles);
    setImages(filesArray);
    const imageUrls = filesArray.map((item) =>
      URL.createObjectURL(item)
    );
    setSrcImages((prevImages) => [...prevImages, ...imageUrls]);
  };
  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    setVideo(e.target.files[0]);

    if (selectedVideo) {
      const videoUrl = URL.createObjectURL(selectedVideo);
      setSrcVideo(videoUrl);
    }
  };
  const handlePost = (e) => {
    e.preventDefault();
    setIsUpload(true);
    if (images && images?.length > 0) {
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
          // All conversions and uploads are complete, continue with the post creation logic
          axios
            .post(
              `${process.env.REACT_APP_BACK_END_URL}/post/user/post`,
              {
                title: title,
                images: downloadURLs,
                group: groupId ? groupId : null,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  token: userDetails.accessToken,
                },
              }
            )
            .then((data) => {
              setIsUpload(false);
              setTitle("");
              setImages(null);
              setSrcImages([]);
              getPost();
              notify("success", "Your post has been published!");
            })
            .catch((error) => {
              notify(
                "error",
                "An error occurred. Please try again later!"
              );
              // Handle error from the server
            });
        })
        .catch((error) => {
          notify(
            "error",
            "An error occurred. Please try again later!"
          );
          // Handle any errors during the conversion and upload process
        });
    }

    if (video) {
      const filename = new Date().getTime() + video.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, video);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          // switch (snapshot.state) {
          //   case "paused":
          //     // console.log("Upload is paused");
          //     break;
          //   case "running":
          //     // console.log("Upload is running");
          //     break;
          // }
          return progress;
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              axios
                .post(
                  `${process.env.REACT_APP_BACK_END_URL}/post/user/post`,
                  {
                    title: title,
                    video: downloadURL,
                    group: groupId ? groupId : null,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      token: userDetails.accessToken,
                    },
                  }
                )
                .then((data) => {
                  setIsUpload(false);
                  setTitle("");
                  setVideo(null);
                  setSrcVideo();
                  getPost();
                  notify("success", "Your post has been published!");
                })
                .catch((error) => {
                  notify(
                    "error",
                    "An error occurred. Please try again later!"
                  );
                  setIsUpload(false);
                  setTitle("");
                  setVideo(null);
                  setSrcVideo();
                  // Handle error from the server
                });
            })
            .catch((error) => {
              notify(
                "error",
                "An error occurred. Please try again later!"
              );

              // Handle any errors during the upload process
            });
        }
      );
    }
    if (images?.length === 0 && !video) {
      axios
        .post(
          `${process.env.REACT_APP_BACK_END_URL}/post/user/post`,
          {
            title: title,
            group: groupId ? groupId : null,
          },
          {
            headers: {
              "Content-Type": "application/json",
              token: userDetails.accessToken,
            },
          }
        )
        .then((data) => {
          setIsUpload(false);
          setTitle("");
          getPost();
          notify("success", "Your post has been published!");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div>
      <div className="relative w-full min-h-[10vh] bg-white mx-auto rounded-lg p-3">
        <div className="flex items-center gap-2 ">
          <ProfileImg src={userDetails.user.avatar} size="medium" />
          <textarea
            type="text"
            className=" outline-none w-full bg-slate-200 rounded-2xl p-2 resize-none h-11 "
            placeholder="Write you real thought ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {isUpload ? (
          <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-slate-300 opacity-40 z-10">
            <l-tailspin
              size="20"
              stroke="3"
              speed="1"
              color="black"
            ></l-tailspin>
          </div>
        ) : null}
        <div className="pt-4">
          {srcImages && (
            <ImagesContainer images={srcImages} setShow={false} />
          )}
          {srcVideo && (
            <video controls className="rounded-lg">
              <source src={srcVideo} type="video/mp4" />
            </video>
          )}
        </div>
        <div className=" flex gap-10 mt-6 items-center border-t-[1px] pt-1">
          <label
            htmlFor="imagePost"
            className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 py-2 px-3 rounded-lg transition-all"
            onClick={() => console.log(1)}
          >
            <Icon src={ImageIcon} pointer size="large" alt="" />
            <span className="hidden md:block">Image</span>
            <input
              type="file"
              name="image"
              id="imagePost"
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>
          <label
            htmlFor="video"
            className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 py-2 px-3 rounded-lg transition-all"
          >
            <Icon src={VideoIcon} pointer size="large" alt="" />
            <span className="hidden md:block">Video</span>
            <input
              type="file"
              name="image"
              id="video"
              style={{ display: "none" }}
              accept="video/*"
              onChange={handleVideoChange}
            />
          </label>
          {/* <Icon src={EmojiIcon} pointer size="medium" alt="" /> */}

          <button
            className={`${
              title
                ? "cursor-pointer hover:opacity-80"
                : " cursor-not-allowed opacity-50"
            } ml-auto px-6 py-[6px] bg-black border-none text-white rounded-md  transition-all`}
            onClick={title ? handlePost : null}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentPost;
