import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/dataFromToken";
connect();

export async function POST(request: NextRequest) {
  try {
    // 1st method to get user from token using jwt library  
    // here we get user by its id and we dont want password so we use select("-password") to get user without password because we dont want to send password in response
    const userId = getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    // 2nd method to get user from token using jwt library
    // const user = await User.findOne({ _id: getDataFromToken(request) });

    return NextResponse.json(
      { message: "User fetched successfully", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
