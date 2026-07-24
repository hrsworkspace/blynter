import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Get search/filter params from the request URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    
    // Fetch blogs from the "blogs" collection
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required fields" },
        { status: 400 }
      );
    }

    const newBlog = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      content: body.content,
      category: body.category || "General",
      subCategory: body.subCategory || "",
      author: body.author || "Anonymous",
      heroImage: body.heroImage || "",
      metaTitle: body.metaTitle || body.title,
      metaDescription: body.metaDescription || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);

    return NextResponse.json(
      { success: true, data: { ...newBlog, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
