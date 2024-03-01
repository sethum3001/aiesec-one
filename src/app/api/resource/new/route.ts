import clientPromise from "@/app/lib/mongodb";
import Resource from "@/models/Resource";

export const POST = async (req: Request) => {
  const { title, url, description, link, functions, keywords } =
    await req.json();

  try {
    const db = (await clientPromise).db();

    const newResource = new Resource({
      title,
      url,
      description,
      link,
      functions,
      keywords
    });

    const collection = db.collection("resources");
    await collection.insertOne(newResource);

    // await newResource.save();

    return new Response(JSON.stringify(newResource), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new resource", { status: 500 });
  }
};
