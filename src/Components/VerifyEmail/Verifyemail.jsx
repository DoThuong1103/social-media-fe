import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmail } from "../../Redux/apiCall";

export default function Verifyemail() {
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const user = useSelector((state) => state.user);
  const userDetails = user.user;
  const id = userDetails?.user;

  const handleOTP = (e) => {
    e.preventDefault();
    VerifyEmail(dispatch, { OTP: OTP, user: id });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="bg-black rounded-lg mx-auto px-8 py-10 w-1/3 ">
        <p className="text-white font-semibold">
          Aavelance Send Email
        </p>
        <form className="flex flex-col gap-2">
          <input
            className="flex-1 min-w-10 my-2 mx-0 p-2 rounded-lg"
            type={"number"}
            placeholder="Enter Your OTP"
            onChange={(e) => setOTP(e.target.value)}
          />
          <button
            className="bg-white w-fit p-2 rounded-lg hover:opacity-90"
            onClick={handleOTP}
          >
            Confirm OTP
          </button>
          <Link to={"/register"}>
            <p className="text-white">
              Check your email to get a OTP
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
}
