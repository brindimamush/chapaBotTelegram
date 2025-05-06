const { Telegraf } = require('telegraf');
const db = require('./database');
const { createPaymentLink } = require('./payment');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHAPA_WEBHOOK_URL = process.env.CHAPA_WEBHOOK_URL;

// Admin commands
bot.command('addproduct', async (ctx) => {
  if (!await isAdmin(ctx.from.id)) return ctx.reply('Unauthorized');
  ctx.reply('Please send product details in format:\nName|Description|Price|ImageURL');
});

bot.command('authorizechannel', async (ctx) => {
  if (!await isAdmin(ctx.from.id)) return ctx.reply('Unauthorized');
  ctx.reply('Forward a message from the channel you want to authorize');
});

// Product handling
bot.on('message', async (ctx) => {
  if (!await isAdmin(ctx.from.id)) return;
  
  if (ctx.message.forward_from_chat) {
    const channelId = ctx.message.forward_from_chat.id;
    db.run('INSERT OR IGNORE INTO channels (channel_id) VALUES (?)', [channelId]);
    return ctx.reply(`Channel ${channelId} authorized!`);
  }

  if (ctx.message.text.includes('|')) {
    const [name, description, price, imageUrl] = ctx.message.text.split('|');
    db.run(
      'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name.trim(), description.trim(), parseFloat(price.trim()), imageUrl.trim()]
    );
    return ctx.reply('Product added successfully!');
  }
});

// Payment handling
bot.action(/buy_(\d+)/, async (ctx) => {
  const productId = ctx.match[1];
  const product = await getProduct(productId);
  const txRef = `TX-${Date.now()}-${ctx.from.id}`;
  
  const paymentLink = await createPaymentLink(
    product.price,
    'ETB',
    txRef,
    CHAPA_WEBHOOK_URL,
    'https://t.me/your_bot',
    { product_id: productId, user_id: ctx.from.id }
  );

  db.run(
    'INSERT INTO orders (user_id, product_id, amount, tx_reference) VALUES (?, ?, ?, ?)',
    [ctx.from.id, productId, product.price, txRef]
  );

  await ctx.reply(`Please complete payment: ${paymentLink}`);
});

async function isAdmin(userId) {
  return new Promise((resolve) => {
    db.get('SELECT is_admin FROM users WHERE chat_id = ?', [userId], (err, row) => {
      resolve(row?.is_admin === 1);
    });
  });
}

async function getProduct(productId) {
  return new Promise((resolve) => {
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
      resolve(row);
    });
  });
}

bot.launch();
console.log('Bot started');