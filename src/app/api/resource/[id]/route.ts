"use client";

import clientPromise from "@/app/lib/mongodb";
import { useRouter } from "next/router";

export const GET = async () => {
  try {
    // Cannot get the dynamic parameter through URL. Needs to be fixed
    const router = useRouter();

    const db = (await clientPromise).db();

    console.log(router.query.id);

    const collection = db.collection("resources");
    // const resource = await collection.find({_id: new ObjectId(resourceId)}).toArray();
    // const resource = await collection.findOne({ _id: new ObjectId(params.id) });

    // if (resource) {
    //     return new Response(JSON.stringify(resource), { status: 200 });
    // } else {
    //     return new Response("Resource not found", { status: 404 });
    // }
  } catch (error) {
    console.error(error);
    return new Response("Failed to retrieve the resource", { status: 500 });
  }
};
