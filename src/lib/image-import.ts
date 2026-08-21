const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const FETCH_TIMEOUT = 30000;
const MAX_REDIRECTS = 4;

function isPrivateIp(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // Hostname-based blocks.
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal")
  )
    return true;

  // IPv6 loopback / link-local / unique-local / IPv4-mapped.
  if (h === "::1" || h === "::" || h === "::ffff:127.0.0.1") return true;
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // fc00::/7
  if (h.startsWith("fe8") || h.startsWith("fe9") || h.startsWith("fea") || h.startsWith("feb"))
    return true; // fe80::/10
  if (h.startsWith("::ffff:")) return isPrivateIp(h.slice(7)); // mapped IPv4

  // IPv4 (also matches bracketless v6-embedded forms).
  if (/^127\./.test(h)) return true; // entire loopback range
  if (/^0\./.test(h)) return true; // "this network"
  if (/^10\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true; // link-local incl. cloud metadata
  if (/^192\.168\./.test(h)) return true;
  if (/^192\.0\.0\./.test(h)) return true;
  if (/^198\.1[89]\./.test(h)) return true; // benchmarking
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(h)) return true; // CGNAT
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;

  return false;
}

/** Validate any hop (initial URL or redirect target) before requesting it. */
function validateHop(u: URL): string | null {
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return "Only HTTP/HTTPS URLs are allowed.";
  }
  if (isPrivateIp(u.hostname)) {
    return "Private/local URLs are not allowed.";
  }
  // Credentials embedded in URLs are never legitimate for image sources.
  if (u.username || u.password) {
    return "URLs with embedded credentials are not allowed.";
  }
  return null;
}

export type ImportResult =
  | {
      ok: true;
      data: ArrayBuffer;
      contentType: string;
      width: number;
      height: number;
      format: string;
      fileSize: number;
    }
  | {
      ok: false;
      error: string;
    };

export async function importExternalImage(rawUrl: string): Promise<ImportResult> {
  let current: URL;
  try {
    current = new URL(rawUrl);
  } catch {
    return { ok: false, error: "Invalid URL format." };
  }

  // Validate the initial hop.
  const initialError = validateHop(current);
  if (initialError) return { ok: false, error: initialError };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let response: Response;
  try {
    // Follow redirects MANUALLY so every hop is validated before it is
    // requested — a public host must not be able to bounce us at cloud
    // metadata endpoints or internal services.
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      response = await fetch(current.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: { "User-Agent": "TaleonMedia/1.0" },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          clearTimeout(timer);
          return { ok: false, error: "Redirect without a Location header." };
        }
        let next: URL;
        try {
          next = new URL(location, current);
        } catch {
          clearTimeout(timer);
          return { ok: false, error: "Invalid redirect target." };
        }
        const hopError = validateHop(next);
        if (hopError) {
          clearTimeout(timer);
          return { ok: false, error: `Redirect blocked: ${hopError}` };
        }
        current = next;
        continue;
      }

      break;
    }
  } catch (e) {
    clearTimeout(timer);
    const message = e instanceof Error ? e.message : "network error";
    return { ok: false, error: `Failed to fetch: ${message}` };
  }
  clearTimeout(timer);

  if (!response!.ok) {
    return {
      ok: false,
      error: `HTTP ${response!.status}: ${response!.statusText}`,
    };
  }

  const contentType = response!.headers.get("content-type") || "";
  const clHeader = response!.headers.get("content-length");
  if (clHeader && parseInt(clHeader, 10) > MAX_FILE_SIZE) {
    return { ok: false, error: "Image exceeds 15 MB limit." };
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return { ok: false, error: `Unsupported image format. Allowed: JPEG, PNG, WEBP, AVIF.` };
  }

  const buffer = await response!.arrayBuffer();
  if (buffer.byteLength > MAX_FILE_SIZE) {
    return { ok: false, error: "Image exceeds 15 MB limit." };
  }

  const bytes = new Uint8Array(buffer.slice(0, 16));
  const mime = detectMime(bytes);
  if (!mime || !ALLOWED_TYPES.includes(mime)) {
    return { ok: false, error: `Unsupported image format. Allowed: JPEG, PNG, WEBP, AVIF.` };
  }

  const dims = detectDimensions(mime, bytes);
  const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";

  return {
    ok: true,
    data: buffer,
    contentType: mime,
    width: dims?.width ?? 0,
    height: dims?.height ?? 0,
    format: ext,
    fileSize: buffer.byteLength,
  };
}

function detectMime(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46)
    return "image/webp";
  return null;
}

function detectDimensions(
  mime: string,
  bytes: Uint8Array,
): { width: number; height: number } | null {
  try {
    if (mime === "image/png" && bytes.length >= 24) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      return { width: view.getUint32(16), height: view.getUint32(20) };
    }
    if (mime === "image/jpeg") {
      let offset = 2;
      while (offset < bytes.length - 1) {
        if (bytes[offset] !== 0xff) break;
        const marker = bytes[offset + 1];
        if (marker === 0xd9 || marker === 0xda) break;
        const segLen = new DataView(bytes.buffer, bytes.byteOffset + offset + 2, 2).getUint16(0);
        if ((marker === 0xc0 || marker === 0xc1 || marker === 0xc2) && segLen >= 7) {
          const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 5, 4);
          return { height: view.getUint16(0), width: view.getUint16(2) };
        }
        offset += 2 + segLen;
      }
    }
    if (mime === "image/webp" && bytes.length >= 30) {
      if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return { width: view.getUint16(26) & 0x3fff, height: view.getUint16(28) & 0x3fff };
      }
      if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x32) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return { width: view.getUint16(26) & 0x3fff, height: view.getUint16(28) & 0x3fff };
      }
    }
  } catch {
    /* unsupported or corrupt header */
  }
  return null;
}

export function sanitizeImportFilename(url: string, format: string): string {
  let name = "image";
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const last = parts[parts.length - 1];
    if (last && last.includes(".")) {
      name =
        last
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .slice(0, 80) || "image";
    }
  } catch {
    /* fall back to default name */
  }
  const ts = Date.now();
  return `${name}-${ts}.${format}`;
}

export { MAX_FILE_SIZE, ALLOWED_TYPES };
