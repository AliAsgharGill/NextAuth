import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    var salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);

    //   send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    //   return NextResponse.json(saveUser, { status: 201 });
    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
