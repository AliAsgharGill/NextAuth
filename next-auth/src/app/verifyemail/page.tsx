"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  ``;
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("api/users/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (error: any) {
      console.log("Getting Error", error.response.data);
    }
  };

  useEffect(() => {
    // this is simple JS method of getting url query
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");

    // best method of getting query from url using router and get all quries
    // const { query } = router;
    // const urlTokenTow = query.token
    // setToken(urlTokenTow || "");
  }, []);

  useEffect(() => {
    setError(false);
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
        <h1 className="text-4xl">Verify Email</h1>
        <h2 className="text-black bg-orange-500 ">
          {token ? `${token}` : "No Token"}
        </h2>
        {verified && (
          <div>
            <h2>Verified</h2>
            <Link href="/login"></Link>
          </div>
        )}
        {verified && (
          <div>
            <h2>Error</h2>
          </div>
        )}
      </div>
    </>
  );
}
