# Thai Bank Slip Verification API — Research (July 2026)

Research question: for a **personal, non-commercial, single-user** finance-tracker (Next.js app in this repo), which Thai slip-verification API is realistic to integrate for auto-filling amount/date/note from a photo of a transfer slip (สลิปโอนเงิน), given low volume (a few slips/day) and no Thai company registration?

All data below was gathered via live web search + page fetches on 2026-07-17. Every claim is cited to its source URL. Where a page's exact wording couldn't be confirmed (fetch tool returned a paraphrase, not raw HTML), that is flagged explicitly — **treat prices/limits as "as advertised at time of writing" and re-verify on the provider's live pricing page before committing**, since these are exactly the kind of numbers vendors change without notice.

---

## Why this exists at all

Thai bank-app QR slips do **not** encode the transaction amount in a way a personal app can just parse. The QR payload is a bank-issued reference/lookup token; getting real transaction data (amount, timestamp, sender/receiver, status) requires **calling the issuing bank's slip-verification backend**, which none of the banks expose to the public directly — only to registered partners. That's the market the five services below fill: they hold direct/partner access to the banks' verification endpoints and resell it as a normalized JSON API.

---

## Providers found

Beyond the three named in the brief (SlipOK, EasySlip, slip2go), search turned up two more real, currently-operating competitors: **Thunder Solution** (thunder.in.th) and **Check Slip** (check-slip.com). All five are confirmed real, currently marketed Thai services as of July 2026 (live pricing pages, docs, and social presence found for each).

### 1. SlipOK (slipok.com)

- **What it returns**: `success`, `message`, `transRef`, `transDate` (`yyyyMMdd`), `transTime` (`HH:mm:ss`), `transTimestamp` (ISO 8601), `amount`, `sendingBank`, `receivingBank`, `sender.displayName`, `receiver.displayName`, `ref1/ref2/ref3`. Documented at [slipok.com/api-documentation/check-slip/](https://slipok.com/api-documentation/check-slip/).
- **Live vs local**: Live — site copy states it "rechecks data through the Bank of Thailand" (re-verification against the issuing bank), per [slipok.com/api/](https://slipok.com/api/) and [slipok.com/what-is-slip-verification-api/](https://slipok.com/what-is-slip-verification-api/).
- **API shape**: `POST https://api.slipok.com/api/line/apikey/<BRANCH_ID>`, header `x-authorization: <API_KEY>`. Accepts **any one of**: `data` (QR string), `files` (image upload — jpg/jpeg/png/jfif/webp), or `url` (hosted image link). Optional `amount` param for server-side amount-match validation, optional `log` flag for extra bank/duplicate checks. Source: [slipok.com/api-documentation/check-slip/](https://slipok.com/api-documentation/check-slip/).
- **Bank coverage**: Explicit bank-code table published — BBL, KBank, KTB, TTB, SCB, BAY, KKP, CIMB Thai, Tisco, UOB(T), Thai Credit Bank, LH Bank, ICBC(Thai), SME Bank, BAAC, EXIM Bank, GSB, GHB (18 banks listed, "v1.8, updated 2024-07-30"). Source: [slipok.com/api-documentation/bank-code/](https://slipok.com/api-documentation/bank-code/).
- **Pricing** (re-fetched directly from [slipok.com/our-service/](https://slipok.com/our-service/) — this is the live pricing page and supersedes any older/cached numbers found in blog posts, which showed lower figures and should be disregarded):

  | Plan | THB/month | Slips/month |
  |---|---|---|
  | OK BASIC | 0 | 100 |
  | OK START | 350 | 500 |
  | OK SME | 600 | 1,000 |
  | OK ENTERPRISE | 1,000 | 2,000 |
  | OK GOLD | 2,580 | 6,000 |
  | OK Titanium | 6,150 | 15,000 |
  | OK Platinum | 11,700 | 30,000 |
  | OK Diamond | 18,600 | 60,000 |
  | OK Vibranium | 28,800 | 150,000 |

  All plans include daily sales summaries and unlimited store/branch creation; overage billed per-slip beyond the monthly quota (rate decreases at higher tiers). **Free tier: 100 slips/month, no time limit mentioned; whether a payment card is required to activate it is not stated on this page.**
- **Signup**: Onboarding asks for brand name, business type, phone number, and (optionally) tax-invoice details "for those who need it" — i.e. tax info looks optional, not gated behind a registered company. No explicit requirement for a **ทะเบียนการค้า/นิติบุคคล** (commercial/juristic registration) document was found in any fetched page. Source: search summary from [oho.chat/blog/slipok](https://www.oho.chat/blog/slipok) and slipok.com pages; **not confirmed from a primary signup-form screenshot**, so treat as likely-individual-friendly but unverified with certainty.

### 2. EasySlip (easyslip.com / document.easyslip.com)

- **What it returns** (API v2, `rawSlip` object): `rawSlip.transRef`, `rawSlip.date`, `rawSlip.amount.amount` + `rawSlip.amount.local.currency`, `rawSlip.sender.bank.{id,name,short}`, `rawSlip.sender.account.name`, `rawSlip.receiver.bank`, `rawSlip.receiver.account.name`, `rawSlip.countryCode`; errors as `error.code`/`error.message`. Source: [document.easyslip.com/en/guide/getting-started](https://document.easyslip.com/en/guide/getting-started).
- **Live vs local**: Live — marketing copy references "Recheck ข้อมูลผ่านธนาคารแห่งประเทศไทย" (re-verifies through Bank of Thailand infrastructure), per [easyslip.com/api-products/](https://easyslip.com/api-products/).
- **API shape**: `POST https://api.easyslip.com/v2/verify/bank` for a QR payload (`{"payload": "..."}`), plus a separate `/v2/verify/bank/image` endpoint for direct image upload (also supports base64/URL). Auth: `Authorization: Bearer <API_KEY>` from a developer-portal app. v1 legacy endpoint (`/v1`) also exists. Source: [document.easyslip.com/en/guide/getting-started](https://document.easyslip.com/en/guide/getting-started).
- **Bank coverage**: Not itemized on any fetched page — no explicit bank list found for EasySlip (unlike SlipOK, which publishes one). Flag as **unverified**.
- **Pricing — two different price lists found, likely two different products**:
  - Developer **API** pricing at [easyslip.com/api-products/](https://easyslip.com/api-products/): Start ฿99/mo (250 requests) → Basic ฿350 (1,000) → Starter ฿700 (2,500) → Beginner ฿1,200 (4,500) → Silver ฿1,500 (6,000) → Gold ฿3,500 (17,500) → Diamond ฿5,000 (35,000) → Premium-1/2/3 up to ฿40,000 (320,000). **No free API tier found** — cheapest paid tier is ฿99/month for 250 calls.
  - Separate **LINE OA / plugin bot service** pricing at [easyslip.com/services/](https://easyslip.com/services/): Beginner ฿799/mo (5,000 slips) → Gold ฿1,599 (20,000) → Diamond ฿2,499 (35,000) → Unlimited ฿3,000. This appears to be a different packaging (chat-bot/e-commerce plugin), not the raw developer API — don't confuse the two when comparing cost per call.
  - Search results also mention a **"free 7-day trial"** for the LINE-bot product ([easyslip.com](https://easyslip.com/) marketing copy), separate from the API-products table above which shows no free tier.
- **Signup**: [document.easyslip.com](https://document.easyslip.com/en/guide/getting-started) states the flow is: sign up at developer.easyslip.com → verify email → **"Complete KYC verification (required for production access)"**. The KYC step's exact document requirements (personal ID vs. company registration) are **not specified in the docs** — this is the single most important unanswered question for this use case and should be checked directly on developer.easyslip.com before committing. One search snippet said EasySlip explicitly "supports both individual users and juristic persons" (บุคคลธรรมดาและนิติบุคคล) per [easyslip.com/api-products/](https://easyslip.com/api-products/) copy — if accurate, this is the only provider with an explicit statement that individuals are allowed, though it's marketing copy, not the KYC form itself.

### 3. slip2go (slip2go.com)

- **What it returns**: `code`, `message`, `referenceId`/`transRef`, `dateTime`, `amount`, `ref1/ref2/ref3`, `sender`/`receiver` objects (account, name, bank). Source: [slip2go.com/guide](https://slip2go.com/guide).
- **Live vs local**: Implied live (routes through bank verification APIs per site copy) but no explicit "Bank of Thailand" phrasing like the other two — **weaker confirmation** than SlipOK/EasySlip.
- **API shape**: `POST /api/verify-slip/qr-code/info`. Auth via an "API Secret" sent in a header on every call, plus optional IP whitelisting. Request body takes a **decoded QR string** (`payload.qrCode`) — unlike SlipOK/EasySlip, **no raw-image-upload endpoint was found** for slip2go, meaning you'd need your own QR decoder (e.g. a JS QR-code reader) before calling their API. Source: [slip2go.com/guide](https://slip2go.com/guide).
- **Bank coverage**: Site documents 30+ entries including Bangkok Bank, Kasikornbank, PromptPay variants, and TrueMoney Wallet — broadest explicit list found among the five. Source: [slip2go.com/guide](https://slip2go.com/guide).
- **Pricing**: Package tiers exist (BASIC/STANDARD/PREMIUM × 1/3/6-month terms) using a **token** system where different outcomes (verified transfer, wrong-recipient slip, expired slip, etc.) deduct different token amounts — but exact THB numbers per tier could not be confirmed from [slip2go.com/pricing](https://slip2go.com/pricing) via the fetch tool (page appears to render pricing client-side / behind JS). One search-result snippet (not independently confirmed) cited "Standard-1: ฿1,388 for 12,500 slips" and "Premium-3: ฿11,888 for 130,000 slips." **New accounts get a free trial of 100 slips** per [slip2go.com/blog/quota-free](https://slip2go.com/blog/quota-free) plus a general "7-day free" mention on [slip2go.com/faq](https://slip2go.com/faq). Treat exact THB figures as unverified pending a direct look at the live pricing page.
- **Signup**: No individual-vs-company distinction found anywhere in fetched pages; registration is via [app.slip2go.com](https://app.slip2go.com) and appears open, but this is **unconfirmed** — no signup-form content was actually retrieved.

### 4. Thunder Solution (thunder.in.th)

- **What it returns**: Not documented field-by-field on the fetched page; marketing copy claims extraction of amount, date/time, sender/receiver, and transaction status, plus duplicate-slip detection. Source: [thunder.in.th/services/api/](https://thunder.in.th/services/api/).
- **Live vs local**: Claims "API แท้" (genuine/authentic API) with "เชื่อมข้อมูลโดยตรงกับธนาคาร" (direct connection with banks) — implies live verification, but no explicit real-time confirmation language like SlipOK/EasySlip. Source: [thunder.in.th/services/api/](https://thunder.in.th/services/api/).
- **API shape**: Bearer-token auth (`Authorization: Bearer <ACCESS_TOKEN>`). No detail found on image-vs-QR-string request format.
- **Bank coverage**: Not itemized; only vague mentions found (no explicit bank list retrieved).
- **Pricing**: Free tier — **100 slips over 15 days** (TESTER plan). Paid: MINI ฿159/mo (400 slips) up to ELITE ฿49,999/mo (400,000 slips), with a 20% annual-subscription discount. Source: [thunder.in.th/services/api/](https://thunder.in.th/services/api/) and [thunder.in.th/blog/slip-verification-api/](https://thunder.in.th/blog/slip-verification-api/).
- **Signup**: Email/account creation at developer.thunder.in.th; no explicit company-registration requirement found, but also no explicit "individuals welcome" statement — **unconfirmed either way**.

### 5. Check Slip (check-slip.com)

- **What it returns**: Marketing copy only — "automatic slip verification" and "automatic amount confirmation" via image analysis; no field-level schema found (may not even expose a public REST API, more geared toward LINE OA + dashboard use). Source: [check-slip.com](https://check-slip.com/).
- **Live vs local**: Not specified — copy emphasizes "AI-based" fraud detection, not explicit bank-side re-verification, which is a meaningfully weaker claim than SlipOK/EasySlip's "rechecks with Bank of Thailand" language.
- **API shape**: Signup uses Google OAuth. No REST endpoint/auth-header details were found in the fetched content — this service may be LINE-OA/dashboard-first rather than a documented developer API.
- **Bank coverage**: Not specified.
- **Pricing**: Free trial — **50 slips per shop**. Paid tiers (all incl. 7% VAT): Trial ฿99 (150 slips), Starter ฿199 (300), Small ฿499 (1,000), Medium ฿999 (2,500, marked "recommended"), Large ฿1,999 (7,500), Premium ฿4,999 (50,000). Source: search-result summary citing [check-slip.com](https://check-slip.com/) — **page content for exact plan names came from a WebFetch summary, not manually cross-checked against raw HTML**, so re-verify before relying on it.
- **Signup**: Google OAuth-based, no stated individual-vs-company gate — probably the most casual-signup of the five based on what was found, but there is no confirmed developer API to actually call from code (may be dashboard/LINE-only), which is a real risk for programmatic use.

### Related tooling found (not a hosted API, worth noting)

**slipverify** ([github.com/maythiwat/slipverify](https://github.com/maythiwat/slipverify)) — an open-source (MIT) TypeScript SDK that provides one unified `inquiry()` interface across multiple backends: direct bank integrations (SCB, KBank) plus third-party providers (SlipOK, EasySlip, Thunder, RDCW) and TrueMoney. It does **not** replace needing an account with one of the above services — it's a client wrapper, and the README states it's designed for **server-side use only** because it handles provider credentials. For a Next.js server action this is actually a reasonable fit *architecturally* since credentials never reach the client, but it doesn't remove the need to sign up with SlipOK/EasySlip/etc. and doesn't solve the account-registration question at all.

---

## Bank-direct APIs (checked per the brief's suggestion)

- **KBank (Kasikornbank) — K API "Slip Verification"**: real, official product page at [apiportal.kasikornbank.com/product/public/All/Slip%20Verification/Introduction](https://apiportal.kasikornbank.com/product/public/All/Slip%20Verification/Introduction). The portal is a JavaScript single-page app that repeated fetch attempts could not render (returned only the page title "K APi" with no body content) — pricing, exact request/response schema, and signup requirements **could not be read directly** through available tools. A search-engine snippet describes it as one of "4 API products" KBank/KBTG released, open to "external organizations and individuals," but that phrasing comes from a search summary, not a directly quoted primary-source sentence — treat as a lead to check by visiting the portal directly, not a confirmed fact.
- **SCB — checkslip.scb.co.th**: confirmed to be a **consumer-facing web lookup tool, not a developer API**. Its own page states verification is "for verification of money transfer or payment transaction. It does not confirm that the money has been credited in the payee's account," and works by manually typing a reference ID, originating bank, and amount into a web form — [checkslip.scb.co.th/web/main](https://checkslip.scb.co.th/web/main). This rules SCB's own tool out as a programmatic integration option.
- **Krungsri (Bank of Ayudhya) — Developer Portal**: real portal at [developers.krungsri.com](https://developers.krungsri.com/). Its payment-status-inquiry capability appears tied to partners already using Krungsri's own "Make A Pay (KMA)" payment-collection product (querying by transaction reference) rather than a generic "verify any bank's slip photo" endpoint — narrower fit than the dedicated SaaS providers above, not investigated further.

## Payment gateways / fintechs checked — no slip-verification product found

Per the brief's suggestion to check whether general payment gateways also sell slip verification: **Opn (Omise), 2C2P, Chillpay, and Beam were checked and none show a dedicated slip-verification product on their own documentation sites.** Opn/Omise's docs ([docs.opn.ooo](https://docs.opn.ooo/th/thailand)) cover card/source/token payment collection, not verification of incoming transfer slips. 2C2P's developer docs ([developer.2c2p.com](https://developer.2c2p.com/)) cover a "COUNTER" channel (paying via barcode/QR at a physical counter) — a different concept (accepting a payment method) from verifying an already-completed bank transfer slip. No official Chillpay or Beam documentation surfaced mentioning slip verification at all. **Could not confirm any of the four offer this as a product** — absence of evidence, not a confirmed "no."

## Another named provider found, not deeply investigated

**RDCW Slip Verify** ([slip.rdcw.co.th](https://slip.rdcw.co.th/)) — confirmed to be a real operating company via its own copyright notice ("© RDCW Co., Ltd."), offering a slip-verification product with its own `/pricing` and `/docs` pages. Given time constraints, pricing, exact API shape, signup requirements, and real-time-verification claims were **not investigated in depth** — flagging as a real but under-researched sixth option worth a look if none of the five above work out.

---

## Side-by-side comparison

| | SlipOK | EasySlip | slip2go | Thunder Solution | Check Slip |
|---|---|---|---|---|---|
| Live bank re-verification (explicit claim) | Yes ("Bank of Thailand recheck") | Yes ("Bank of Thailand recheck") | Implied, not explicit | Implied ("direct bank connection") | Not claimed (AI-framed) |
| Accepts raw image upload | Yes (`files`/`url`) | Yes (`/v2/verify/bank/image`) | No confirmed — QR string only | Unconfirmed | Unclear (may be dashboard-only) |
| Accepts decoded QR string | Yes (`data`) | Yes (`payload`) | Yes (`payload.qrCode`) | Unconfirmed | Unclear |
| Free tier | 100 slips/mo, ongoing | None found for API (LINE-bot has "7-day free" mention) | 100 slips (new-account trial) | 100 slips / 15 days | 50 slips / shop |
| Cheapest paid tier | ฿350/mo (500 slips) | ฿99/mo (250 calls) | Unconfirmed exact THB | ฿159/mo (400 slips) | ฿99/mo (150 slips, incl. VAT) |
| Published bank list | Yes, 18 banks | No | Yes, 30+ entries | No | No |
| Individual (non-juristic) signup confirmed | Not explicitly confirmed, but no hard company-registration requirement found | Not explicitly confirmed; KYC gate exists for "production access," scope unclear | Not confirmed either way | Not confirmed either way | Not confirmed either way; Google OAuth suggests casual signup, but no confirmed public API |
| Primary source docs | [slipok.com/api-documentation](https://slipok.com/api-documentation/check-slip/) | [document.easyslip.com](https://document.easyslip.com/en/guide/getting-started) | [slip2go.com/guide](https://slip2go.com/guide) | [thunder.in.th/services/api](https://thunder.in.th/services/api/) | [check-slip.com](https://check-slip.com/) |

**Important caveat on the "individual vs. juristic person" question**: this is the single fact the brief cares about most, and it is the fact **none of the five providers state unambiguously in their public docs**. Every provider's signup flow asks for business-ish info (brand name, business type) but none of the fetched pages showed a hard block requiring a ทะเบียนพาณิชย์/company registration document to get an API key for low-volume/free-tier use — free tiers appear designed for "try it as a shop owner" self-service signup, which in practice is normally open to a sole individual providing a phone number and email, not a registered corporation. But this is an **inference from marketing pages, not a confirmed policy statement** for any of the five. The only provider with copy that explicitly claims to support "individuals and juristic persons" is EasySlip (per api-products page copy) — still not the same as reading the actual KYC form.

---

## Recommendation for this project (solo dev, personal, non-commercial, a few slips/day)

**SlipOK's free "OK BASIC" tier (100 slips/month, ฿0) is the best fit**, for these reasons:

1. **Free tier comfortably covers the stated volume** — a few slips/day is well under 100/month, so this project would likely never need to pay.
2. **Best-documented API of the five** — full response schema (`transRef`, `transDate`/`transTime`, `amount`, `sendingBank`/`receivingBank`, `sender.displayName`/`receiver.displayName`, `ref1-3`) is published at [slipok.com/api-documentation/check-slip/](https://slipok.com/api-documentation/check-slip/), which maps directly onto this app's transaction form fields (amount → `transaction.amount`, date → `transDate`+`transTime`, a note could be built from `sender.displayName`/`receiver.displayName`).
3. **Accepts a raw image upload directly** (`files` param) — so the Next.js server action can forward the uploaded slip photo as-is without writing a QR decoder first. This is materially simpler than slip2go, which appears to require decoding the QR client-side before calling its API.
4. **Publishes an explicit, checkable bank-code list** (18 major Thai banks) — easy to sanity-check "does this cover my bank" before building anything.
5. **Signup path looks the lightest of the three "named" providers** — brand name/business type/phone, with tax-invoice info framed as optional, and no confirmed hard company-registration gate.

**Second choice: EasySlip**, if SlipOK's bank-code list doesn't cover the specific bank(s) this project needs (SlipOK's list omits, e.g., LINE BK — not seen in the fetched bank-code table) — EasySlip's API accepts both image and QR-string input and has a cheap ฿99/250-call entry tier, but (a) it has no confirmed free API tier, and (b) its "KYC for production access" requirement is the one open question worth resolving with a support email before signing up, since it's unclear if it demands a business document.

**Do not build around slip2go or Thunder Solution for this use case**: slip2go's API needs a QR string, not an image, so it adds a client-side QR-decode dependency for no benefit at these volumes; Thunder's free tier is time-boxed (15 days, not recurring monthly like SlipOK's), which is worse for a long-running personal app. **Check Slip is the weakest option** — it's the only one where a genuine public developer API (vs. LINE-bot/dashboard-only) could not be confirmed at all from public docs.

**Practical next step before writing code**: email SlipOK support (or just attempt the OK BASIC signup with a personal email/phone) to confirm in practice — since none of the five providers' public docs state their KYC/registration policy in writing, the only fully reliable way to close this open question is to actually attempt the signup flow, which this research task did not do (no accounts were created).

---

## Sources

- https://slipok.com/api/
- https://slipok.com/api-documentation/check-slip/
- https://slipok.com/api-documentation/bank-code/
- https://slipok.com/our-service/
- https://slipok.com/what-is-slip-verification-api/
- https://www.oho.chat/blog/slipok
- https://document.easyslip.com/en/guide/getting-started
- https://document.easyslip.com/
- https://easyslip.com/api-products/
- https://easyslip.com/services/
- https://easyslip.com/
- https://slip2go.com/guide
- https://slip2go.com/pricing
- https://slip2go.com/faq
- https://slip2go.com/blog/quota-free
- https://thunder.in.th/services/api/
- https://thunder.in.th/blog/slip-verification-api/
- https://check-slip.com/
- https://github.com/maythiwat/slipverify
- https://apiportal.kasikornbank.com/product/public/All/Slip%20Verification/Introduction
- https://checkslip.scb.co.th/web/main
- https://developers.krungsri.com/
- https://docs.opn.ooo/th/thailand
- https://developer.2c2p.com/
- https://slip.rdcw.co.th/

---

*Note on methodology*: several pages above (slip2go pricing table, Check Slip's plan list, some EasySlip signup-requirement text) were retrieved through an AI-summarizing fetch tool rather than raw HTML inspection, and are flagged inline as such. Numbers that could not be corroborated by a second source are called out explicitly rather than stated as fact — re-check the live pricing pages before committing to a provider, especially slip2go's and Check Slip's exact THB figures.
