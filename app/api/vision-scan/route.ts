import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  imageBase64: string;
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 }: RequestBody = await req.json();
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: null, error: "Add GOOGLE_CLOUD_VISION_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [
                { type: "TEXT_DETECTION", maxResults: 1 },
                { type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Vision API error:", err);
      return NextResponse.json({ text: null, error: "Vision API error." }, { status: 502 });
    }

    const data = await res.json();
    const fullText =
      data?.responses?.[0]?.fullTextAnnotation?.text ??
      data?.responses?.[0]?.textAnnotations?.[0]?.description ??
      null;

    return NextResponse.json({ text: fullText });
  } catch (err) {
    console.error("vision-scan error:", err);
    return NextResponse.json({ text: null, error: "Server error." }, { status: 500 });
  }
}
