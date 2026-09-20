import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OrderPayload {
  name?: string;
  phone?: string;
  product?: string;
  density?: string;
  thickness?: string;
  quantity?: string;
  price?: string;
  note?: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let body: OrderPayload;
  try {
    body = (await req.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const product = (body.product ?? "").trim();
  const density = (body.density ?? "").trim();
  const thickness = (body.thickness ?? "").trim();
  const quantity = (body.quantity ?? "").trim();
  const price = (body.price ?? "").trim();
  const note = (body.note ?? "").trim();

  if (!name || !phone || !product || !quantity) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Configured server-side; if missing, report honestly so the UI can show
    // an appropriate error instead of a fake success.
    return NextResponse.json(
      { ok: false, error: "telegram_not_configured" },
      { status: 503 }
    );
  }

  const date = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Tashkent",
    hour: "2-digit",
    minute: "2-digit",
  });

  const text = [
    "🔵 <b>YANGI BUYURTMA</b>",
    "",
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(phone)}`,
    `📦 <b>Mahsulot:</b> ${escapeHtml(product)}`,
    `📐 <b>Zichligi:</b> ${escapeHtml(density || "—")}`,
    `📏 <b>Qalinligi:</b> ${escapeHtml(thickness || "—")}`,
    `🔢 <b>Miqdori:</b> ${escapeHtml(quantity)}`,
    `💰 <b>Narxi:</b> ${escapeHtml(price || "—")}`,
    `📝 <b>Izoh:</b> ${escapeHtml(note || "—")}`,
    `🕐 <b>Sana:</b> ${date} (Tashkent)`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Telegram API error", res.status, errText);
      return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Telegram request failed", e);
    return NextResponse.json({ ok: false, error: "telegram_failed" }, { status: 502 });
  }
}
