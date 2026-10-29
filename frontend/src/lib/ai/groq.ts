import Groq from "groq-sdk";

const globalForGroq = globalThis as unknown as { groq: Groq | undefined };

export const groq =
  globalForGroq.groq ??
  new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy-key-for-build",
  });

if (process.env.NODE_ENV !== "production") globalForGroq.groq = groq;

export const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/** Retry a Groq call up to `maxRetries` times on rate-limit (429) errors */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 15000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes("rate_limit") ||
          err.message.includes("Rate limit") ||
          (err as { status?: number }).status === 429);
      if (isRateLimit && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt); // 15s, 30s, 60s
        console.warn(`[Groq] Rate limit hit. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}
