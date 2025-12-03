import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing image URL" },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(imageUrl);
    console.log("Fetching image from:", decodedUrl);

    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://vegamoviesnl.info/",
        "Accept": "image/*",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    console.log(`Image buffer size: ${buffer.byteLength} bytes, content-type: ${contentType}`);

    if (buffer.byteLength === 0) {
      console.error("Received empty image buffer");
      return NextResponse.json(
        { error: "Received empty image" },
        { status: 500 }
      );
    }

    // Check if we got HTML instead of image
    if (contentType.includes("text/html") || contentType.includes("application/json")) {
      console.error(`Got wrong content type: ${contentType}`);
      return NextResponse.json(
        { error: `Expected image but got ${contentType}` },
        { status: 400 }
      );
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: `Failed to proxy image: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
