interface FetchOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

interface MicrolinkResponse {
  status: string;
  data?: { image?: { url?: string } };
}

export async function fetchInstagramThumbnail(
  url: string,
  { timeoutMs = 8000, signal }: FetchOptions = {},
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onParentAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onParentAbort, { once: true });
  }
  try {
    const res = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
      { signal: controller.signal },
    );
    const json = (await res.json()) as MicrolinkResponse;
    if (json.status === "success" && json.data?.image?.url) {
      return json.data.image.url;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", onParentAbort);
  }
}
