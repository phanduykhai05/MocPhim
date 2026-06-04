const SECRET  = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? "mocphim-revalidate-2026";
const ORIGIN  = typeof window !== "undefined"
  ? window.location.origin
  : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Flush Next.js ISR cache for the given paths.
 * Non-critical — never throws, failure is silently ignored.
 */
export async function triggerRevalidate(paths: string[]): Promise<void> {
  try {
    await fetch(`${ORIGIN}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: SECRET, paths }),
    });
  } catch {
    // ignore — cache expires automatically after revalidate window
  }
}
