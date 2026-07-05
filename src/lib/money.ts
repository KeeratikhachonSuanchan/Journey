export function formatMoney(
  amount: string | number,
  locale: "en" | "th" = "en"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const intlLocale = locale === "th" ? "th-TH" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function parseMoney(input: string): string {
  const cleaned = input.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "0";
  return num.toFixed(2);
}
