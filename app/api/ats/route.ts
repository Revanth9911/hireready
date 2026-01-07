import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { Buffer } from "buffer";

const KEYWORDS = [
  "javascript",
  "react",
  "node",
  "html",
  "css",
  "git",
  "api",
  "database",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    // ✅ DOC / DOCX — reliable
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const data = await mammoth.extractRawText({ buffer });
      text = data.value;
    }
    // ⚠️ PDF — fallback (MVP-safe)
    else if (file.type === "application/pdf") {
      return NextResponse.json({
        score: 0,
        missing: KEYWORDS,
        note: "PDF parsing limited in MVP. Please upload DOCX for accurate results.",
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    text = text.toLowerCase();

    let matched = 0;
    const missing: string[] = [];

    for (const keyword of KEYWORDS) {
      if (text.includes(keyword)) {
        matched++;
      } else {
        missing.push(keyword);
      }
    }

    const score = Math.round((matched / KEYWORDS.length) * 100);

    return NextResponse.json({ score, missing });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
