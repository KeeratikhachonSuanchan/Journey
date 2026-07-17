"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScanIcon } from "lucide-react";
import { extractSlipData, type SlipExtraction } from "./actions";
import { useT } from "@/lib/i18n/context";

// Keeps the upload small and caps Claude's vision token cost — well above
// what's needed to read printed slip text.
const MAX_LONG_EDGE = 1568;
const JPEG_QUALITY = 0.85;

async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}

export function ScanSlipDialog({
  onExtracted,
}: {
  onExtracted: (data: SlipExtraction) => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setFile(null);
    setLoading(false);
    setFailed(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setFailed(false);

    const resized = await resizeImage(file);
    const formData = new FormData();
    formData.append("slipImage", resized, "slip.jpg");

    const result = await extractSlipData(formData);
    setLoading(false);

    if (!result.amount && !result.occurredOn && !result.note) {
      setFailed(true);
      return;
    }

    onExtracted(result);
    setOpen(false);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <ScanIcon />
        {t.finance.scanSlip}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.finance.scanSlipDialogTitle}</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="slip-upload">{t.finance.scanSlipUploadLabel}</Label>
          <Input
            id="slip-upload"
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFailed(false);
              setFile(e.target.files?.[0] ?? null);
            }}
          />
        </div>
        {failed && (
          <p className="text-sm text-destructive">{t.finance.scanSlipFailed}</p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.common.cancel}
          </DialogClose>
          <Button type="button" disabled={!file || loading} onClick={handleSubmit}>
            {loading ? t.finance.scanSlipExtracting : t.finance.scanSlipSubmit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
