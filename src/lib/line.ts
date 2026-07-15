const LINE_BROADCAST_URL = "https://api.line.me/v2/bot/message/broadcast";

type LineMessage = Record<string, unknown>;

// Broadcasts to every friend of the bot channel. Fine for a single-user app
// (only you should ever add this bot as a friend) and avoids needing to look
// up/store a LINE userId.
export async function broadcastLineMessages(messages: LineMessage[]): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");

  const res = await fetch(LINE_BROADCAST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE broadcast failed (${res.status}): ${body}`);
  }
}

const MAX_ROWS = 10;

// Same palette as the site's dark theme (src/app/globals.css `.dark`),
// converted from oklch to hex since Flex Message colors must be hex.
const DARK = {
  card: "#14110f", // --card
  text: "#ebe7e1", // --card-foreground
  accent: "#f8a13f", // --primary
  accentText: "#130b05", // --primary-foreground
  muted: "#78746e", // --muted-foreground
  border: "#272320", // --border
};

export type HabitReminderItem = { title: string; goalTitle?: string };

// A Flex Message bubble: header banner, bulleted habit list (each with its
// linked goal, if any), and a button linking back into the app. altText is
// what shows in LINE's chat list/push notification preview, since flex
// content itself doesn't render there.
export function buildHabitReminderFlex(
  items: HabitReminderItem[],
  todayUrl: string
): LineMessage {
  const shown = items.slice(0, MAX_ROWS);
  const remaining = items.length - shown.length;

  const rows: LineMessage[] = shown.map(({ title, goalTitle }) => ({
    type: "box",
    layout: "horizontal",
    spacing: "sm",
    contents: [
      { type: "text", text: "●", size: "xs", color: DARK.accent, flex: 0 },
      {
        type: "box",
        layout: "vertical",
        spacing: "xs",
        contents: [
          { type: "text", text: title, wrap: true, size: "sm", color: DARK.text },
          ...(goalTitle
            ? [{ type: "text", text: `🎯 ${goalTitle}`, wrap: true, size: "xxs", color: DARK.muted }]
            : []),
        ],
      },
    ],
  }));

  if (remaining > 0) {
    rows.push({
      type: "text",
      text: `และอีก ${remaining} รายการ`,
      size: "xs",
      color: DARK.muted,
      margin: "md",
    });
  }

  return {
    type: "flex",
    altText: `วันนี้คุณทำสิ่งเหล่านี้แล้วหรือยัง? (${items.length} รายการ)`,
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: DARK.card },
        body: { backgroundColor: DARK.card },
        footer: { backgroundColor: DARK.card, separator: true, separatorColor: DARK.border },
      },
      header: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "วันนี้คุณทำสิ่งเหล่านี้แล้วหรือยัง?",
            color: DARK.accent,
            weight: "bold",
            size: "lg",
            wrap: true,
          },
          {
            type: "text",
            text: `${items.length} รายการรอคุณอยู่`,
            color: DARK.muted,
            size: "sm",
            margin: "sm",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: rows,
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        contents: [
          {
            type: "button",
            style: "primary",
            color: DARK.accent,
            action: { type: "uri", label: "ไปหน้า Today", uri: todayUrl },
          },
        ],
      },
    },
  };
}
