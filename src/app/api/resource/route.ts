import clientPromise from "@/app/lib/mongodb";
// import Resource from "@/models/Resource";

export const GET = async () => {
  try {
    const db = (await clientPromise).db();

    const collection = db.collection("resources");
    const resources = await collection.find({}).toArray();

    // const resources = await Resource.find();

    return new Response(JSON.stringify(resources), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all resources", { status: 500 });
  }
};
