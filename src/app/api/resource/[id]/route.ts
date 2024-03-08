import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    // Extract the dynamic parameter (id) from the path parameter
    const { id } = context.params;

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const db = (await clientPromise).db();
    const collection = db.collection("resources");

    // Convert the dynamic parameter to an ObjectId and query the database
    const resource = await collection.findOne({ _id: new ObjectId(id) });

    if (resource) {
      return NextResponse.json(resource);
    } else {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to retrieve the resource" },
      { status: 500 }
    );
  }
};
