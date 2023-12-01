import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../Redux/apiCall";
import { notify } from "../../Redux/notify";
import { returnLogin } from "../../Redux/userReducer";
const Login = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (error) {
      notify("error", "Email or password is incorrect");
      dispatch(returnLogin());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  const handleLogin = async (e) => {
    if (password && email) {
      e.preventDefault();
      await login(dispatch, { email, password });
    }
  };

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
            Login Social
          </p>
          <input
            type="text place email"
            className="flex p-2 mt-5 outline-none rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email && password) {
                login(dispatch, { email, password });
              }
            }}
            required
          />
          <input
            type="password"
            placeholder="********"
            className="flex p-2 mt-5 outline-none rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email && password) {
                login(dispatch, { email, password });
              }
            }}
            required
          />
          <button
            className={` py-1 my-3 rounded-lg  text-white transition-all ${
              email && password
                ? "cursor-pointer bg-blue-400 hover:bg-blue-500"
                : "cursor-not-allowed bg-blue-300"
            }`}
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
          <Link
            to="/forgot/password"
            className="cursor-pointer hover:underline hover:decoration-1 transition-all pb-2 text-black"
          >
            Forgot Password
          </Link>
          <Link
            to="/register"
            className="cursor-pointer hover:underline hover:decoration-1 transition-all text-black"
          >
            Create New Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
