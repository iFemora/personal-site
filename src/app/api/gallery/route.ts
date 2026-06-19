import { NextRequest, NextResponse } from "next/server";

const REPO = "iFemora/personal-site";
const MANIFEST_PATH = "content/gallery.json";
const IMAGE_DIR = "public/gallery";
const BRANCH = "main";

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function normalizeBase64(s: string): string {
  let body = s;
  if (body.startsWith("data:")) {
    const comma = body.indexOf(",");
    if (comma >= 0) body = body.slice(comma + 1);
  }
  body = body.replace(/\s+/g, "");
  body = body.replace(/-/g, "+").replace(/_/g, "/");
  return body;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

type ManifestEntry = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  location?: string;
  date?: string;
  width: number;
  height: number;
};

export async function POST(req: NextRequest) {
  const githubToken = process.env.GITHUB_PAT;
  const sharedSecret = process.env.FIELD_NOTES_SECRET;

  if (!githubToken || !sharedSecret) {
    return NextResponse.json(
      { error: "server not configured (missing env vars)" },
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${sharedSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    imageBase64?: string;
    caption?: string;
    location?: string;
    date?: string;
    width?: number | string;
    height?: number | string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const imageBase64 = payload.imageBase64?.trim();
  if (!imageBase64) {
    return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
  }

  const caption = (payload.caption ?? "").trim();
  const location = (payload.location ?? "").trim();
  const width = Number(payload.width) || 1200;
  const height = Number(payload.height) || 1500;

  const now = new Date();
  const yyyy = now.getFullYear();
  const stamp = `${yyyy}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}-${pad2(now.getHours())}${pad2(now.getMinutes())}`;
  const captionSlug = caption ? slugify(caption) : "photo";
  const id = `${stamp}${captionSlug ? `-${captionSlug}` : ""}`;
  const date = (payload.date ?? "").trim() || String(yyyy);

  const filename = `${id}.jpg`;
  const repoImagePath = `${IMAGE_DIR}/${filename}`;
  const src = `/gallery/${filename}`;
  const commitMessage = `gallery: ${caption || id}`;

  // 1. Upload the image.
  const uploadRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${repoImagePath}`,
    {
      method: "PUT",
      headers: {
        ...GH_HEADERS,
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: normalizeBase64(imageBase64),
        branch: BRANCH,
      }),
    }
  );

  if (!uploadRes.ok) {
    const detail = await uploadRes.text();
    return NextResponse.json(
      { error: "image upload failed", status: uploadRes.status, detail },
      { status: 502 }
    );
  }

  // 2. Fetch + update the manifest.
  const manifestRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${MANIFEST_PATH}?ref=${BRANCH}`,
    {
      headers: { ...GH_HEADERS, Authorization: `Bearer ${githubToken}` },
      cache: "no-store",
    }
  );

  if (!manifestRes.ok) {
    const detail = await manifestRes.text();
    return NextResponse.json(
      { error: "manifest fetch failed", status: manifestRes.status, detail },
      { status: 502 }
    );
  }

  const manifestMeta = (await manifestRes.json()) as {
    sha: string;
    content: string;
  };
  const currentJson = Buffer.from(manifestMeta.content, "base64").toString(
    "utf-8"
  );

  let frames: ManifestEntry[];
  try {
    frames = JSON.parse(currentJson) as ManifestEntry[];
    if (!Array.isArray(frames)) throw new Error("manifest is not an array");
  } catch (e) {
    return NextResponse.json(
      { error: "manifest is malformed", detail: String(e) },
      { status: 500 }
    );
  }

  const entry: ManifestEntry = {
    id,
    src,
    alt: caption || "Photograph",
    width,
    height,
  };
  if (caption) entry.caption = caption;
  if (location) entry.location = location;
  entry.date = date;

  frames.unshift(entry);

  const updated = JSON.stringify(frames, null, 2) + "\n";
  const updateRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${MANIFEST_PATH}`,
    {
      method: "PUT",
      headers: {
        ...GH_HEADERS,
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(updated, "utf-8").toString("base64"),
        sha: manifestMeta.sha,
        branch: BRANCH,
      }),
    }
  );

  if (!updateRes.ok) {
    const detail = await updateRes.text();
    return NextResponse.json(
      { error: "manifest update failed", status: updateRes.status, detail },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    id,
    src,
    permalink: `https://ifemora.dev/gallery`,
  });
}
