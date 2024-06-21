import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
connect();

export async function POST(request: NextRequest) {
  try {
    // here we will get email and password from request body and check if user exists with email and password
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });

    // if user not found with email address then return error message and status 400
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    console.log("User found", user);

    // if password is not valid then return error message and status 400

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }
    // if user email is not verified then return error message and status 400
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email first" },
        { status: 400 }
      );
    }

    // if user is valid then create token and return success message and status 200
    const tokenData = {
      // here usually only id is required but here we are using id and username and email but it will consume more bandwidth
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    // here below we will not write return keyword because we also want to send cookies so we need to write NextResponse.json only and store it in variable
    const response = NextResponse.json(
      { message: "Login success", token, success: true },
      { status: 200 }
    );

    // now we have response variable so we can write response.cookies.set() method
    // in set method only token is required but we can also set some options and httpOnly is very important due httpOnly server can change and manipulate cookie, user can only view it.
    
    response.cookies.set("token", token, {
      httpOnly: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// these all are options in cookies for sending cookies to frontend from backend
// response.cookies.set("token", token, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60,
//     sameSite: "strict",
//     secure: true,
//     path: "/",
//   });
