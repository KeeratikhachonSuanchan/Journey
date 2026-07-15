import { Receiver } from "@upstash/qstash";
import { sendHabitReminder } from "@/lib/habit-reminder";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(request: Request) {
  const signature = request.headers.get("upstash-signature");
  const body = await request.text();

  const valid =
    !!signature && (await receiver.verify({ signature, body }).catch(() => false));

  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await sendHabitReminder();
  return Response.json(result);
}
