import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  audioBase64: string;
  mimeType?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { audioBase64, mimeType }: RequestBody = await req.json();
    const apiKey = process.env.GOOGLE_CLOUD_SPEECH_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { transcript: null, error: "Add GOOGLE_CLOUD_SPEECH_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Detect encoding from mime type
    const encoding =
      mimeType === "audio/webm" ? "WEBM_OPUS" :
      mimeType === "audio/ogg"  ? "OGG_OPUS"  :
      mimeType === "audio/mp4"  ? "MP4"        :
      "WEBM_OPUS";

    const res = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            encoding,
            sampleRateHertz: 48000,
            languageCode: "en-US",
            enableAutomaticPunctuation: true,
            model: "latest_long",
          },
          audio: { content: audioBase64 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Speech API error:", err);
      return NextResponse.json(
        { transcript: null, error: "Speech-to-Text API error." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const transcript =
      data?.results
        ?.map((r: { alternatives?: { transcript?: string }[] }) => r.alternatives?.[0]?.transcript ?? "")
        .join(" ")
        .trim() ?? null;

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("speech-to-text error:", err);
    return NextResponse.json({ transcript: null, error: "Server error." }, { status: 500 });
  }
}
