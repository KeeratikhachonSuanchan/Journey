"use client";

import { useRef, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addUserWord } from "../../actions";
import { useT } from "@/lib/i18n/context";

type Status = "idle" | "saved" | "duplicate" | "invalid";

export function AddWordForm() {
  const t = useT().english;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lastWord, setLastWord] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const word = (formData.get("word") as string) ?? "";
    setLastWord(word);
    startTransition(async () => {
      const result = await addUserWord(formData);
      if (result.ok) {
        setStatus("saved");
        formRef.current?.reset();
      } else {
        setStatus(result.reason);
      }
    });
  }

  const levelItems = { A1: "A1", A2: "A2", B1: "B1", B2: "B2" };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.addWord}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="word">{t.wordLabel}</Label>
            <Input id="word" name="word" required onChange={() => setStatus("idle")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="meaning">{t.meaningLabel}</Label>
            <Input id="meaning" name="meaning" required onChange={() => setStatus("idle")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="example">{t.exampleLabel}</Label>
            <Textarea id="example" name="example" required onChange={() => setStatus("idle")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="level">{t.levelLabel}</Label>
            <Select name="level" required defaultValue="A2" items={levelItems}>
              <SelectTrigger id="level" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(levelItems).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pos">{t.posLabel}</Label>
            <Input id="pos" name="pos" />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {t.addWord}
          </Button>

          {status === "saved" && <p className="text-xs text-success">{t.wordSaved}</p>}
          {status === "duplicate" && (
            <p className="text-xs text-destructive">{t.duplicateWord(lastWord)}</p>
          )}
          {status === "invalid" && <p className="text-xs text-destructive">{t.invalidWord}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
