import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

// POST and GET both methods can be used for logout in logout we will remove token from cookies and set it to expire

//  if made sessions then we also need to set them in database and then call them from database and need to clean them from database

connect();
export async function POST(request: any) {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully", success: true },
      { status: 200 }
    );

    // because next response type ka so hum iss main say cookies access krskty hain.
    // we also need to set options to delete cookies that we used in login route and also expires if used in login.
    // response.cookies.delete("token");
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
