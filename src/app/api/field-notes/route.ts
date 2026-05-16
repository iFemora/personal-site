import { NextRequest, NextResponse } from "next/server";

const REPO = "iFemora/personal-site";
const MANIFEST_PATH = "content/field-notes.json";
const AUDIO_DIR = "public/field-notes/audio";
const BRANCH = "main";

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function buildId(now: Date, title: string): { id: string; isoDate: string } {
  const yyyy = now.getFullYear();
  const mm = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const hh = pad2(now.getHours());
  const mi = pad2(now.getMinutes());
  const titleSlug = slugifyTitle(title);
  const id = `${yyyy}-${mm}-${dd}-${hh}${mi}${titleSlug ? `-${titleSlug}` : ""}`;
  const isoDate = `${yyyy}-${mm}-${dd}`;
  return { id, isoDate };
}

type ManifestEntry = {
  id: string;
  date: string;
  body?: string;
  audio?: { src: string; title?: string };
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

  // Auth: shortcut must send Authorization: Bearer <FIELD_NOTES_SECRET>
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${sharedSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    title?: string;
    body?: string;
    audioBase64?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const title = (payload.title ?? "").trim();
  const body = (payload.body ?? "").trim();
  const audioBase64 = payload.audioBase64?.trim();

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!audioBase64 && !body) {
    return NextResponse.json(
      { error: "either audio or body must be provided" },
      { status: 400 }
    );
  }

  const now = new Date();
  const { id, isoDate } = buildId(now, title);
  const commitMessage = `field note: ${title}`;

  // 1. Upload audio file if present
  let audioRelPath: string | undefined;
  if (audioBase64) {
    const audioFilename = `${id}.m4a`;
    const audioRepoPath = `${AUDIO_DIR}/${audioFilename}`;
    audioRelPath = `/field-notes/audio/${audioFilename}`;

    const uploadRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${audioRepoPath}`,
      {
        method: "PUT",
        headers: {
          ...GH_HEADERS,
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: audioBase64,
          branch: BRANCH,
        }),
      }
    );

    if (!uploadRes.ok) {
      const detail = await uploadRes.text();
      return NextResponse.json(
        { error: "audio upload failed", status: uploadRes.status, detail },
        { status: 502 }
      );
    }
  }

  // 2. Fetch current manifest (to get its sha + content)
  const manifestRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${MANIFEST_PATH}?ref=${BRANCH}`,
    {
      headers: {
        ...GH_HEADERS,
        Authorization: `Bearer ${githubToken}`,
      },
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

  let notes: ManifestEntry[];
  try {
    notes = JSON.parse(currentJson) as ManifestEntry[];
    if (!Array.isArray(notes)) throw new Error("manifest is not an array");
  } catch (e) {
    return NextResponse.json(
      { error: "manifest is malformed", detail: String(e) },
      { status: 500 }
    );
  }

  // 3. Build new entry and prepend (so most-recent appears first in the file too)
  const newEntry: ManifestEntry = { id, date: isoDate };
  if (audioRelPath) {
    newEntry.audio = { src: audioRelPath, title };
  }
  if (body) {
    newEntry.body = body;
  }

  notes.unshift(newEntry);

  const updatedContent = JSON.stringify(notes, null, 2) + "\n";
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
        content: Buffer.from(updatedContent, "utf-8").toString("base64"),
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
    date: isoDate,
    audio: audioRelPath,
    permalink: `https://ifemora.dev/field-notes#${id}`,
  });
}
