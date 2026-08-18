export const maxImageBytes = 2_000_000;

export type ImageResult =
  | { ok: true; dataUrl: string; compressed: boolean }
  | { ok: false; reason: "not-image" | "too-large" | "unreadable" };

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("no se pudo leer la imagen"));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// Redibuja la imagen en un canvas achicando calidad y tamaño hasta que entre en el límite.
async function compress(file: File): Promise<Blob | null> {
  const original = await fileToDataUrl(file);
  const image = await loadImageElement(original);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  let scale = 1;
  let quality = 0.85;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= maxImageBytes) return blob;
    scale *= 0.85;
    quality = Math.max(0.4, quality - 0.1);
  }
  return null;
}

export async function prepareImage(file: File): Promise<ImageResult> {
  if (!file.type.startsWith("image/")) return { ok: false, reason: "not-image" };
  if (file.size <= maxImageBytes) return { ok: true, dataUrl: await fileToDataUrl(file), compressed: false };
  try {
    const blob = await compress(file);
    if (!blob) return { ok: false, reason: "too-large" };
    return { ok: true, dataUrl: await fileToDataUrl(blob), compressed: true };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}
