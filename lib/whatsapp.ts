// WhatsApp Cloud API integration (optional, behind env flag)
// Set WHATSAPP_CLOUD_API_ENABLED=true to enable

interface WhatsAppMessage {
  to: string;
  message: string;
}

export async function sendWhatsAppNotification(
  data: WhatsAppMessage
): Promise<void> {
  if (process.env.WHATSAPP_CLOUD_API_ENABLED !== "true") return;

  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp Cloud API credentials not configured");
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: data.to,
          type: "text",
          text: { body: data.message },
        }),
      }
    );

    if (!response.ok) {
      console.error("WhatsApp API error:", await response.text());
    }
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
  }
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string
): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildEnquiryMessage(data: {
  name: string;
  mobile: string;
  college?: string;
  course?: string;
  message?: string;
  greeting?: string;
}): string {
  const parts = [
    data.greeting || "Hello Prathvi Group of College!",
    `I am ${data.name}.`,
    `Mobile: ${data.mobile}.`,
  ];

  if (data.college && data.course) {
    parts.push(`I am interested in ${data.college} - ${data.course}.`);
  } else if (data.college) {
    parts.push(`I am interested in ${data.college}.`);
  } else if (data.course) {
    parts.push(`I am interested in ${data.course}.`);
  }

  if (data.message) {
    parts.push(data.message);
  }

  return parts.join(" ");
}
