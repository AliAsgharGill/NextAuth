"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
const Login = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      setButtonDisabled(true);
      const response = await axios.post(
        "http://localhost:3000/api/users/signup",
        user
      );
      console.log("response", response.data);
      toast.success(response.data.message);
      router.push("/login");
    } catch (error: any) {
      console.log("Getting error", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <div className="flex flex-col items-center jsutify-center  min-h-screen py-2 ">
        <h1>{loading ? "Processing..." : "Signup"}</h1>
        <hr />
        <form>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={user.username}
            placeholder="Username"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={user.email}
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            placeholder="*******"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button onClick={onSignup}>
            {buttonDisabled ? "Please Fill Form" : "Signup"}
          </button>
          <Link href="/login">Login Instead</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
