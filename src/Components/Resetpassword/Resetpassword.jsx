import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notify } from "../../Redux/notify";
export default function Resetpassword() {
  const location = useLocation();
  const code = location.search.split("?")[1];
  const [password, setPassword] = useState("");
  const navigator = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    await fetch(
      `${process.env.REACT_APP_BACK_END_URL}/user/reset/password?${code}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ password: password }),
      }
    )
      .then((data) => {
        notify("success", "Password Reset Successfully");
        navigator("/login");
      })
      .catch((error) => {
        notify("error", error.response.data);
      });
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className="flex flex-col gap-4 w-[90%] mx-auto xs:w-[360px] h-[240px] bg-black rounded px-4 py-6">
        <p className="text-white text-2xl font-semibold">
          Enter Your New Password
        </p>
        <input
          type="password"
          className="w-full bg-white outline-none py-1 px-2 rounded "
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-white py-1 px-2 w-28 rounded hover:opacity-80 transition-all"
          onClick={handleClick}
        >
          Set Password
        </button>
      </div>
    </div>
  );
}
