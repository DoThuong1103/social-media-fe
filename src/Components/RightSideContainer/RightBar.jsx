import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileImg from "../CommonComponents/Img/ProfileImg";

const RightBar = () => {
  const [dataUsers, setDataUsers] = useState(null);
  const [users, setUsers] = useState(null);
  const userDetails = useSelector((state) => state.user);
  const accessToken = userDetails.accessToken;

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_END_URL}/user/allFriend/${userDetails.user._id}`,
          {
            headers: {
              token: `${accessToken}`,
            },
          }
        );
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const listUser = users?.map((item) => {
      item.isOnline = userDetails.online?.some(
        (element) => item._id === element
      );
      return item;
    });
    const sortedUsers = listUser?.sort((a, b) =>
      b.isOnline ? 1 : -1
    );
    setDataUsers(sortedUsers);
  }, [users, userDetails.online]);
  return (
    <div className="hidden md:block sticky top-[80px] w-full">
      <div className="flex flex-col gap-4 w-full h-[300px] rounded-2xl px-4 mx-auto">
        <p className="text-xl font-bold ">Contact</p>
        <div className="flex flex-col gap-2 w-full">
          {dataUsers?.map(
            (user, index) => (
              // user.isOnline && (
              <div
                className="flex gap-2 items-center cursor-pointer pl-2 py-1 hover:bg-slate-300 rounded"
                // onClick={() => handleShowMessage(user)}
                key={index}
              >
                <div className="relative">
                  <ProfileImg src={user.avatar} size="medium" />
                  <div
                    className={`absolute bottom-1 right-0 h-3 w-3 rounded-full ${
                      user.isOnline ? "bg-green-600" : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <p className="font-semibold">{user.username}</p>
              </div>
            )
            // )
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
