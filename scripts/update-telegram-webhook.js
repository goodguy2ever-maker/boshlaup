const token = process.env.TELEGRAM_BOT_TOKEN || '9073543052:AAFj4tmSOUWaMXaOexSU9A2uB79DpNi-xTg';
const targetDomain = process.argv[2] || 'https://boshlaup.uz';
const webhookUrl = `${targetDomain}/api/telegram/webhook`;

async function updateWebhook() {
  console.log(`Setting Telegram webhook to: ${webhookUrl}`);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        drop_pending_updates: false,
      }),
    });
    const data = await res.json();
    console.log('Result:', data);

    const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const info = await infoRes.json();
    console.log('Current Webhook Info:', info);
  } catch (err) {
    console.error('Failed to set webhook:', err);
  }
}

updateWebhook();
