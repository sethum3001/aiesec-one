import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { isValidId } from "@/app/util/uitls";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    // Extract the dynamic parameter (id) from the path parameter
    const { id } = context.params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
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

export const PUT = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const collection = db.collection("resources");

    // Assuming the request body contains the updated data
    const updatedData = JSON.parse(await req.text());

    // Update the document
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "Resource updated successfully" });
    } else {
      return NextResponse.json(
        { message: "Resource not updated" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update the resource" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  try {
    const { id } = context.params;

    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const collection = db.collection("resources");

    // Delete the document
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "Resource deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete the resource" },
      { status: 500 }
    );
  }
};
