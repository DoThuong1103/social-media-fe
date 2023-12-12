import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../Redux/apiCall";

const Register = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const userDetails = user;
  const navigator = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    signup(dispatch, {
      email,
      password,
      username,
      phonenumber,
    });
  };
  if (userDetails?.Status === "Pending") {
    console.log(1);
    navigator("/verify/email");
  }
  console.log(userDetails);
  return (
    <div className="h-[100vh] bg-slate-100 flex items-center ">
      <div className="flex flex-col md:flex-row justify-center gap-4 lg:gap-10 items-center m-auto w-full">
        <div className="">
          <p className="text-5xl text-center font-semibold">
            Soc<span className="text-blue-500">ial</span>
          </p>
          <p className="text-xl text-center pt-4">
            Connect with your{" "}
            <span className="text-blue-500 font-semibold">
              family and friends
            </span>
          </p>
        </div>
        <div className="flex flex-col w-10/12 md:w-[360px] lg:w-[420px]">
          <p className="text-xl text-start font-semibold">
            Create New Account
          </p>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setusername(e.target.value)}
            className="flex p-2 mt-5 outline-none rounded-lg"
          />
          <input
            type="text"
            placeholder="Phonenumber"
            onChange={(e) => setphonenumber(e.target.value)}
            className="flex p-2 mt-5 outline-none rounded-lg"
          />
          <input
            type="email"
            name=""
            id=""
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            className="flex p-2 mt-5 outline-none rounded-lg"
          />
          <input
            type="password"
            placeholder="******"
            name=""
            onChange={(e) => setpassword(e.target.value)}
            id=""
            className="flex p-2 mt-5 outline-none rounded-lg"
          />
          <button
            className="bg-slate-200 py-1 my-3 rounded-lg hover:bg-blue-400 hover:text-white transition-all"
            onClick={handleClick}
          >
            Signup
          </button>
          <Link
            to="/login"
            className="cursor-pointer hover:underline hover:decoration-1 transition-all"
          >
            Already have a count?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
