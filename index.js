require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Bot, InlineKeyboardBuilder } = require('node-telegram-bot-api');
const { run } = require('node-telegram-bot-api/node');

// 1. បរិស្ថាន និង Configuration
const PORT = process.env.PORT || 3000;
const token = process.env.BOT_TOKEN;
const CONFIG_PATH = path.join(__dirname, 'config.json');

if (!token) {
  console.error('❌ សូមកំណត់ BOT_TOKEN នៅក្នុង file .env ជាមុនសិន!');
  process.exit(1);
}

// Helper: អាន Config
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading config.json:', err);
  }
  return {
    welcomeMessage: '👋 <b>សួស្តី {name}!</b>\n\n🎉 <b>សូមស្វាគមន៍មកកាន់ Telegram Bot!</b>\nWelcome to <b>@{bot_name}</b> 🤖\n\n📋 <b>Profile:</b>\n• 🆔 <b>ID:</b> <code>{id}</code>\n• 👤 <b>ឈ្មោះ:</b> {name}',
    buttons: [
      { text: 'ℹ️ អំពី Bot', type: 'callback', value: 'btn_about' },
      { text: '❓ ជំនួយ', type: 'callback', value: 'btn_help' },
      { text: '🌐 បើក Telegram Bot', type: 'url', value: 'https://t.me/vatanak20168_bot' }
    ],
    adminPasscode: 'admin123',
    updatedAt: new Date().toISOString()
  };
}

// Helper: រក្សាទុក Config
function saveConfig(newConfig) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
}

let botConfig = loadConfig();

// In-Memory Stats & Activity Log
const stats = {
  totalStarts: 0,
  totalMessages: 0,
  uniqueUsers: new Set(),
  startedAt: new Date()
};
const activityLogs = [];

function logActivity(type, user, details) {
  const logItem = {
    id: Date.now() + Math.random().toString(36).substring(2, 6),
    type,
    user: {
      id: user?.id || 'Unknown',
      first_name: user?.first_name || 'Anonymous',
      username: user?.username ? `@${user.username}` : ''
    },
    details,
    timestamp: new Date().toLocaleTimeString('km-KH', { hour12: true })
  };
  activityLogs.unshift(logItem);
  if (activityLogs.length > 50) activityLogs.pop();
}

// 2. បង្កើត Telegram Bot Instance
const bot = new Bot(token);
let botInfo = null;

// Helper ជំនួស Tag នៅក្នុង Welcome Message
function formatWelcomeMessage(template, user) {
  const firstName = user?.first_name || 'មិត្តភក្តិ';
  const username = user?.username ? `@${user.username}` : 'មិនមាន';
  const userId = user?.id || 'N/A';
  const botUsername = botInfo?.username || 'vatanak20168_bot';

  return template
    .replace(/{name}/g, firstName)
    .replace(/{first_name}/g, firstName)
    .replace(/{username}/g, username)
    .replace(/{id}/g, userId)
    .replace(/{user_id}/g, userId)
    .replace(/{bot_name}/g, botUsername);
}

// Helper បង្កើត Inline Keyboard
function buildInlineKeyboard(buttons) {
  const builder = new InlineKeyboardBuilder();
  if (!buttons || !Array.isArray(buttons) || buttons.length === 0) {
    return builder.build();
  }

  // រៀបចំ Button ជា 2 ក្នុងមួយជួរ ឬតាមការកំណត់
  buttons.forEach((btn, index) => {
    if (index > 0 && index % 2 === 0) {
      builder.row();
    }
    if (btn.type === 'url') {
      builder.url(btn.text || 'Link', btn.value || 'https://t.me');
    } else {
      builder.text(btn.text || 'Button', btn.value || `action_${index}`);
    }
  });

  return builder.build();
}

// Command: /start
bot.command('start', async (ctx) => {
  const user = ctx.from;
  stats.totalStarts++;
  if (user?.id) stats.uniqueUsers.add(user.id);
  logActivity('start', user, 'បានចុច /start');

  const welcomeText = formatWelcomeMessage(botConfig.welcomeMessage, user);
  const keyboard = buildInlineKeyboard(botConfig.buttons);

  try {
    await ctx.reply(welcomeText, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('Error sending welcome message in HTML mode, falling back to plain text:', err.message);
    await ctx.reply(welcomeText.replace(/<[^>]*>?/gm, ''), {
      reply_markup: keyboard,
    });
  }
});

// Command: /help
bot.command('help', async (ctx) => {
  const helpText = 
    `📖 <b>បញ្ជីពាក្យបញ្ជា (Available Commands):</b>\n\n` +
    `• /start - ចាប់ផ្ដើមដំណើរការ bot និងបង្ហាញសារ Welcome\n` +
    `• /help - បង្ហាញព័ត៌មានជំនួយ\n` +
    `• /ping - ពិនិត្យមើលស្ថានភាពដំណើរការ bot`;
  await ctx.reply(helpText, { parse_mode: 'HTML' });
});

// Command: /ping
bot.command('ping', async (ctx) => {
  const uptimeMinutes = Math.floor(process.uptime() / 60);
  await ctx.reply(`🏓 <b>Pong!</b> Bot កំពុងដំណើរការយ៉ាងរលូន។\n⏱️ Uptime: ${uptimeMinutes} នាទី`, { parse_mode: 'HTML' });
});

// Callback Query (ពេលចុច Inline Buttons)
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery?.data;
  logActivity('callback', ctx.from, `ចុចប៊ូតុង: ${data}`);

  if (data === 'btn_about') {
    await ctx.answerCallbackQuery({ text: 'ℹ️ អំពី Bot' });
    await ctx.reply(
      `🤖 <b>អំពី Bot នេះ:</b>\n` +
      `• ឈ្មោះ: @${botInfo?.username || 'vatanak20168_bot'}\n` +
      `• ប្រព័ន្ធគ្រប់គ្រង: Web Admin UI (Port ${PORT})\n` +
      `• ស្ថានភាព: Online ✅`,
      { parse_mode: 'HTML' }
    );
  } else if (data === 'btn_help') {
    await ctx.answerCallbackQuery({ text: '❓ ជំនួយ' });
    await ctx.reply('💡 អ្នកអាចប្រើពាក្យ /start ឬ /help ដើម្បីទទួលព័ត៌មានបន្ថែម។', { parse_mode: 'HTML' });
  } else {
    await ctx.answerCallbackQuery({ text: `អ្នកបានចុច ${data}` });
    await ctx.reply(`⚡ Action ត្រូវបានទទួល: <code>${data}</code>`, { parse_mode: 'HTML' });
  }
});

// Regular Message
bot.on('message', async (ctx) => {
  const text = ctx.message?.text;
  if (!text || text.startsWith('/')) return;

  stats.totalMessages++;
  if (ctx.from?.id) stats.uniqueUsers.add(ctx.from.id);
  logActivity('message', ctx.from, `ផ្ញើសារ: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);

  await ctx.reply(`📩 <b>បានទទួលសារ៖</b> <i>"${text}"</i>\n\nសូមចុច /start ដើម្បីបើកផ្ទាំងសារស្វាគមន៍ឡើងវិញ។`, {
    parse_mode: 'HTML'
  });
});

bot.catch((err) => {
  console.error('Bot error caught:', err.message || err);
});

// 3. បង្កើត Web Admin Server (Express API)
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // allow root index.html

// API: ពិនិត្យមើល Status របស់ Bot & Web Server
app.get('/api/status', (req, res) => {
  res.json({
    online: true,
    bot: botInfo || { username: 'vatanak20168_bot', id: 8978213859 },
    stats: {
      totalStarts: stats.totalStarts,
      totalMessages: stats.totalMessages,
      uniqueUsersCount: stats.uniqueUsers.size,
      uptimeSeconds: Math.floor(process.uptime()),
      startedAt: stats.startedAt
    }
  });
});

// API: ទទួលយក Config បច្ចុប្បន្ន
app.get('/api/config', (req, res) => {
  res.json({
    welcomeMessage: botConfig.welcomeMessage,
    buttons: botConfig.buttons,
    updatedAt: botConfig.updatedAt
  });
});

// API: រក្សាទុក Welcome Message និង Button ថ្មី (Admin កែប្រែ)
app.post('/api/config', (req, res) => {
  const { passcode, welcomeMessage, buttons } = req.body;

  // ផ្ទៀងផ្ទាត់ Passcode Admin (default: admin123)
  if (passcode !== botConfig.adminPasscode && passcode !== 'admin123') {
    return res.status(401).json({
      success: false,
      error: 'លេខសម្ងាត់ Admin មិនត្រឹមត្រូវទេ! (Default PIN: admin123)'
    });
  }

  if (!welcomeMessage || typeof welcomeMessage !== 'string' || !welcomeMessage.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Welcome message មិនអាចទទេបានទេ!'
    });
  }

  // អាប់ដេត Config ក្នុង Memory និង save ចូល file config.json
  botConfig.welcomeMessage = welcomeMessage.trim();
  if (Array.isArray(buttons)) {
    botConfig.buttons = buttons;
  }
  botConfig.updatedAt = new Date().toISOString();
  saveConfig(botConfig);

  console.log('✅ Admin បានធ្វើបច្ចុប្បន្នភាព Welcome Message ដោយជោគជ័យ!');

  return res.json({
    success: true,
    message: 'Welcome message ត្រូវបានកែប្រែ និងរក្សាទុកដោយជោគជ័យ!',
    updatedAt: botConfig.updatedAt
  });
});

// API: Activity logs
app.get('/api/logs', (req, res) => {
  res.json({
    logs: activityLogs,
    stats: {
      totalStarts: stats.totalStarts,
      totalMessages: stats.totalMessages,
      uniqueUsersCount: stats.uniqueUsers.size
    }
  });
});

// API: ផ្ញើ Test Message ទៅកាន់ Telegram User ID (បើមាន)
app.post('/api/test-send', async (req, res) => {
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).json({ success: false, error: 'សូមបញ្ចូល Telegram Chat ID / User ID!' });
  }

  try {
    const testUser = { id: chatId, first_name: 'Admin Tester', username: 'admin' };
    const text = formatWelcomeMessage(botConfig.welcomeMessage, testUser);
    const keyboard = buildInlineKeyboard(botConfig.buttons);

    await bot.api.sendMessage({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: keyboard
    });

    return res.json({ success: true, message: `បានផ្ញើសារសាកល្បងទៅកាន់ ID ${chatId} ដោយជោគជ័យ!` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. ចាប់ផ្ដើមដំណើរការ Web Server និង Telegram Bot
async function startServer() {
  // ចាប់ផ្ដើម Express Server
  app.listen(PORT, () => {
    console.log(`🌐 Web Admin Dashboard កំពុងដំណើរការនៅ: http://localhost:${PORT}`);
  });

  // ចាប់ផ្ដើម Telegram Bot
  try {
    botInfo = await bot.api.getMe();
    console.log('====================================');
    console.log(`🤖 Bot @${botInfo.username} បានតភ្ជាប់ជោគជ័យ!`);
    console.log(`📡 Bot ID: ${botInfo.id}`);
    console.log(`🌍 Web Admin UI: http://localhost:${PORT}`);
    console.log('💬 កំពុងរង់ចាំសារ Telegram...');
    console.log('====================================');
    
    // ចាប់ផ្ដើម Long Polling
    await run(bot);
  } catch (err) {
    console.error('❌ បរាជ័យក្នុងការតភ្ជាប់ Telegram Bot:', err.message);
  }
}

startServer();
