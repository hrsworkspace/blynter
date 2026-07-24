import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    console.error("GET /api/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    
    // Build update object
    const updateData = {};
    const allowedFields = [
      "title",
      "slug",
      "content",
      "category",
      "subCategory",
      "author",
      "heroImage",
      "metaTitle",
      "metaDescription",
      "metaKeywords",
      "faqs"
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Auto-update slug if title is updated and slug is not explicitly provided
    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    updateData.updatedAt = new Date();

    const result = await db
      .collection("blogs")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    const updatedDoc = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, data: updatedDoc });
  } catch (error) {
    console.error("PUT /api/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog post ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
