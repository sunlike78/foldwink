import { useState } from "react";
import { Button } from "./Button";
import { renderShareCard, type ShareCardOptions } from "../share/shareCard";

interface Props {
  text: string;
  card?: ShareCardOptions;
  filename?: string;
}

type Status = "idle" | "sharing" | "copied" | "downloaded" | "failed";

async function tryShareFile(file: File, text: string): Promise<boolean> {
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };
  if (typeof nav.share !== "function") return false;
  const data: ShareData = { files: [file], text };
  if (typeof nav.canShare === "function" && !nav.canShare(data)) return false;
  try {
    await nav.share(data);
    return true;
  } catch {
    return false;
  }
}

async function tryCopyImage(blob: Blob): Promise<boolean> {
  const clip = navigator.clipboard as Clipboard & {
    write?: (items: ClipboardItem[]) => Promise<void>;
  };
  const CI = (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem;
  if (!clip || typeof clip.write !== "function" || !CI) return false;
  try {
    await clip.write([new CI({ [blob.type]: blob })]);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function tryCopyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ShareButton({ text, card, filename = "foldwink.png" }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick(): Promise<void> {
    setStatus("sharing");

    // Path A: we have a card — render it and try the image-first pipeline.
    if (card) {
      const blob = await renderShareCard(card);
      if (blob) {
        const file = new File([blob], filename, { type: "image/png" });
        if (await tryShareFile(file, text)) {
          setStatus("idle");
          return;
        }
        if (await tryCopyImage(blob)) {
          setStatus("copied");
          setTimeout(() => setStatus("idle"), 1800);
          return;
        }
        try {
          downloadBlob(blob, filename);
          setStatus("downloaded");
          setTimeout(() => setStatus("idle"), 1800);
          return;
        } catch {
          // fall through to text
        }
      }
    }

    // Path B: text-only — navigator.share, then clipboard text.
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
        setStatus("idle");
        return;
      }
    } catch {
      // user cancelled share — fall through
    }
    if (await tryCopyText(text)) {
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1800);
      return;
    }
    setStatus("failed");
    setTimeout(() => setStatus("idle"), 2400);
  }

  let label = "Share result";
  if (status === "sharing") label = "Preparing…";
  if (status === "copied") label = "Copied!";
  if (status === "downloaded") label = "Saved image";
  if (status === "failed") label = "Share unavailable";

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className="w-full"
      disabled={status === "sharing"}
    >
      {label}
    </Button>
  );
}
