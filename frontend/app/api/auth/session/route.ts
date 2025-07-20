import {auth} from "@/utils/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session) {
      return new Response(JSON.stringify(session), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "No session found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}