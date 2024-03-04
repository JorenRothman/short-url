import { findBySlug, incrementCount } from "@/server/short-url/method";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const path = new URL(request.url).pathname;

  const slug = path.split("/").pop();

  if (!slug) {
    return new Response("Not found", {
      status: 404,
    });
  }

  const data = await findBySlug(slug);

  if (!data) {
    return new Response("Not found", {
      status: 404,
    });
  }

  incrementCount(slug);

  redirect(data.url);
}
