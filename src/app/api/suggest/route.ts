import { suggest } from "@/lib/pdok";

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 3) return Response.json([]);
  try { return Response.json(await suggest(q)); } catch { return Response.json([], { status: 502 }); }
}
