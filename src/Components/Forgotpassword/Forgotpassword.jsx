import React, { useState } from "react";
import { notify } from "../../Redux/notify";

export default function Forgotpassword() {
  const [email, setEmail] = useState("");
  const handleClick = async (e) => {
    e.preventDefault();
    await fetch(
      `${process.env.REACT_APP_BACK_END_URL}/user/forgot/password`,
      {
        method: "post",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ email: email }),
      }
    )
      .then(() => {
        notify("success", "Check your email to reset password");
        // alert("We sent you a token email");
      })
      .catch((error) => {
        notify(
          "error",
          "Something went wrong. Please try again later."
        );
      });
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className="flex flex-col gap-4 w-[90%] mx-auto xs:w-[360px] h-[240px] bg-black rounded px-4 py-6">
        <p className="text-white text-2xl font-semibold">
          Enter your email!
        </p>
        <input
          type="text"
          className="w-full bg-white outline-none py-1 px-2 rounded "
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button
          className="bg-white py-1 px-2 w-20 rounded hover:opacity-80 transition-all"
          onClick={handleClick}
        >
          Send
        </button>
      </div>
    </div>
  );
}
